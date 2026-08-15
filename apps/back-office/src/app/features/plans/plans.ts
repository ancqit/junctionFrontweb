import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  FREE_TRIAL_DAYS,
  PlanOption,
  PlanSummary,
  PlanType,
  PRODUCT_PACK_PRICE_INR,
  PRODUCT_PACK_SIZE,
} from '../../core/models';
import { paymentCompleteBucket, ShopPayment } from '../../core/payments.api';
import { PlanApplication, planDisplayName, PlansApi } from '../../core/plans.api';
import {
  DEFAULT_PACK_PRICE_INR,
  DEFAULT_PACK_SIZE,
  ProductBucket,
  ProductBucketApi,
} from '../../core/product-bucket.api';
import { ShopPaymentFlowService } from '../../core/shop-payment-flow.service';
import { Shop, ShopsApi } from '../../core/shops.api';

export type PlansViewMode = 'plans' | 'waitlist';

@Component({
  selector: 'app-plans',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class PlansPage implements OnInit {
  private readonly api = inject(PlansApi);
  private readonly shopsApi = inject(ShopsApi);
  private readonly bucketApi = inject(ProductBucketApi);
  private readonly paymentFlow = inject(ShopPaymentFlowService);

  readonly plans = signal<PlanOption[]>([]);
  readonly current = signal<PlanSummary | null>(null);
  readonly application = signal<PlanApplication | null>(null);
  readonly shop = signal<Shop | null>(null);
  readonly bucket = signal<ProductBucket | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly bucketBusy = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly trialDays = FREE_TRIAL_DAYS;

  /** Toggle: browse plans vs your waitlist status. */
  readonly viewMode = signal<PlansViewMode>('plans');
  /** Plan the user is confirming before Razorpay checkout. */
  readonly confirmPlanType = signal<PlanType | null>(null);

  readonly packSize = computed(
    () => this.bucket()?.pack_size ?? DEFAULT_PACK_SIZE ?? PRODUCT_PACK_SIZE,
  );
  readonly packPrice = computed(
    () => this.bucket()?.pack_price_inr ?? DEFAULT_PACK_PRICE_INR ?? PRODUCT_PACK_PRICE_INR,
  );

  readonly shopReady = computed(() => {
    const shop = this.shop();
    return !!shop?.id && !!shop.name?.trim() && !!shop.city?.trim() && !!shop.locality?.trim();
  });

  readonly onWaitlist = computed(() => {
    const app = this.application();
    return !!app && String(app.status).toLowerCase() === 'pending';
  });

  readonly confirmPlan = computed(() => {
    const type = this.confirmPlanType();
    if (!type) {
      return null;
    }
    return this.plans().find((plan) => plan.type === type) ?? null;
  });

  ngOnInit(): void {
    this.reload();
  }

  setViewMode(mode: PlansViewMode): void {
    this.viewMode.set(mode);
    this.error.set('');
    this.success.set('');
    this.confirmPlanType.set(null);
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.confirmPlanType.set(null);

    forkJoin({
      plans: this.api.list().pipe(catchError(() => of([] as PlanOption[]))),
      application: this.api.myApplication().pipe(catchError(() => of(null))),
      shops: this.shopsApi.list().pipe(catchError(() => of([] as Shop[]))),
      current: this.api.me().pipe(catchError(() => of(null as PlanSummary | null))),
      bucket: this.bucketApi.get().pipe(catchError(() => of(null as ProductBucket | null))),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ plans, application, shops, current, bucket }) => {
          this.plans.set(plans.length ? plans : []);
          this.application.set(application);
          const activeId =
            typeof localStorage !== 'undefined'
              ? localStorage.getItem('junction.activeShopId')?.trim()
              : null;
          const active = activeId ? shops.find((row) => row.id === activeId) : null;
          this.shop.set(active ?? shops[0] ?? null);
          this.current.set(current);
          this.bucket.set(bucket);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load plans.')),
      });
  }

  /** Confirm dialog before Razorpay checkout for a paid plan. */
  requestPurchase(planType: PlanType): void {
    if (planType === 'free_trial') {
      this.error.set('Free trial starts automatically when you create an account.');
      return;
    }
    const plan = this.plans().find((row) => row.type === planType);
    if (!plan || !this.canSelect(plan)) {
      return;
    }
    this.error.set('');
    this.success.set('');
    this.confirmPlanType.set(planType);
  }

  cancelConfirm(): void {
    this.confirmPlanType.set(null);
  }

  /** Create pending plan payment and open Razorpay Checkout. */
  confirmPurchase(): void {
    const planType = this.confirmPlanType();
    if (!planType || planType === 'free_trial') {
      return;
    }
    const shop = this.shop();
    if (!shop?.id) {
      this.error.set('Add your shop name, city, and locality on Overview before paying for a plan.');
      this.confirmPlanType.set(null);
      return;
    }
    if (!shop.city?.trim() || !shop.locality?.trim()) {
      this.error.set(
        'Your shop needs a city and locality before you can pay. Update them on Overview.',
      );
      this.confirmPlanType.set(null);
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.shopsApi.purchasePlan(shop.id, planType).subscribe({
      next: (payment) => {
        this.confirmPlanType.set(null);
        this.collectPayment(payment, 'plan');
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set(this.readError(err, 'Could not start plan purchase.'));
      },
    });
  }

  /** Buy one product pack (40 slots) via Razorpay. */
  purchaseProductPack(): void {
    if (!this.shop()?.id) {
      this.error.set('Select a shop before buying a product pack.');
      return;
    }
    this.bucketBusy.set(true);
    this.error.set('');
    this.success.set('');
    this.bucketApi
      .purchasePacks(1)
      .pipe(finalize(() => this.bucketBusy.set(false)))
      .subscribe({
        next: (result) => {
          if (!result) {
            return;
          }
          if (this.isBucket(result)) {
            this.bucket.set(result);
            this.success.set(
              `Added ${this.packSize()} product slots. Capacity is now ${result.capacity ?? '—'}.`,
            );
            return;
          }
          this.collectPayment(result as ShopPayment, 'pack');
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not purchase a product pack.')),
      });
  }

  requestedPlanName(app: PlanApplication): string {
    return planDisplayName(app.requested_plan_type, this.plans());
  }

  productLimitLabel(plan: PlanOption | PlanSummary): string {
    if (plan.profile_only || plan.max_products === 0) {
      return 'Profile only · yearly';
    }
    if (plan.max_products === null) {
      return 'Unlimited products · yearly';
    }
    if (plan.type === 'free_trial') {
      const days = 'duration_days' in plan ? (plan.duration_days ?? this.trialDays) : this.trialDays;
      return `Up to ${plan.max_products} products for ${days} days`;
    }
    return `Up to ${plan.max_products} products · 1 year`;
  }

  isCurrent(planType: PlanType): boolean {
    const current = this.current();
    return !!current && current.is_active && current.type === planType;
  }

  canSelect(plan: PlanOption | undefined): boolean {
    if (!plan || plan.type === 'free_trial') {
      return false;
    }
    if (!this.shopReady()) {
      return false;
    }
    return !this.isCurrent(plan.type);
  }

  private collectPayment(payment: ShopPayment, kind: 'plan' | 'pack'): void {
    const busy = kind === 'plan' ? this.saving : this.bucketBusy;
    busy.set(true);
    this.paymentFlow
      .collect(payment)
      .pipe(finalize(() => busy.set(false)))
      .subscribe({
        next: (done) => {
          if (done.plan) {
            this.current.set(done.plan);
          }
          const bucket = paymentCompleteBucket(done);
          if (bucket) {
            this.bucket.set(bucket);
          } else if (kind === 'pack') {
            this.reloadBucket();
          }
          this.success.set(
            done.message?.trim() ||
              (kind === 'plan' ? 'Plan payment completed.' : 'Product pack payment completed.'),
          );
          if (kind === 'plan') {
            this.api.me().subscribe({
              next: (state) => this.current.set(state),
              error: () => undefined,
            });
          }
        },
        error: (err: unknown) => {
          const message = this.readError(err, 'Payment could not be completed.');
          if (message.toLowerCase().includes('cancelled')) {
            this.error.set('Payment cancelled. Your plan was not charged.');
            return;
          }
          this.error.set(message);
        },
      });
  }

  private reloadBucket(): void {
    this.bucketApi.get().subscribe({
      next: (bucket) => this.bucket.set(bucket),
      error: () => undefined,
    });
  }

  private isBucket(value: ShopPayment | ProductBucket): value is ProductBucket {
    return 'can_add_product' in value && 'products_count' in value;
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string }; message?: string })?.error?.detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }
    const message = (error as { message?: string })?.message;
    return typeof message === 'string' && message.trim() ? message : fallback;
  }
}
