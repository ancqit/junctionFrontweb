import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentShopService } from '../../core/current-shop.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import {
  FREE_TRIAL_DAYS,
  PlanOption,
  PlanSummary,
  PlanType,
  PRODUCT_PACK_PRICE_INR,
  PRODUCT_PACK_SIZE,
} from '../../core/models';
import { PaymentsApi, ShopPayment } from '../../core/payments.api';
import { PlanApplication, planDisplayName, PlansApi } from '../../core/plans.api';
import {
  DEFAULT_PACK_PRICE_INR,
  DEFAULT_PACK_SIZE,
  ProductBucket,
  ProductBucketApi,
} from '../../core/product-bucket.api';
import { ShopLockService } from '../../core/shop-lock.service';
import { Shop, ShopsApi } from '../../core/shops.api';
import {
  InlineSelectComponent,
  InlineSelectOption,
} from '../../shared/inline-select/inline-select';

export type PlansViewMode = 'plans' | 'payments';

/** User-facing add-on bucket sizes (backend packs are 40 slots @ pack price). */
export type BucketAddonSlots = 40 | 80 | 120;

const BUCKET_ADDON_OPTIONS: readonly BucketAddonSlots[] = [40, 80, 120];

/** Map UI size → packs billed (120 slots = 3 packs). */
const BUCKET_ADDON_MAP: Record<BucketAddonSlots, { packs: number; billedSlots: number }> = {
  40: { packs: 1, billedSlots: 40 },
  80: { packs: 2, billedSlots: 80 },
  120: { packs: 3, billedSlots: 120 },
};

/** Visual FIFO queue row for waitlist / payment history. */
export interface PlanQueueItem {
  id: string;
  kind: 'waitlist' | 'payment';
  title: string;
  status: string;
  created_at: string;
  detail: string;
}

/** Last prepare-payment breakdown shown on the pending landing. */
export interface PrepPaymentSummary {
  planName: string;
  planPrice: number;
  bucketLabel: string;
  bucketPrice: number;
  packs: number;
  billedSlots: number;
  requestedSlots: number | null;
  total: number;
}

@Component({
  selector: 'app-plans',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, RouterLink, TranslatePipe, InlineSelectComponent],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class PlansPage implements OnInit {
  private readonly api = inject(PlansApi);
  private readonly currentShop = inject(CurrentShopService);
  private readonly bucketApi = inject(ProductBucketApi);
  private readonly paymentsApi = inject(PaymentsApi);
  private readonly shopsApi = inject(ShopsApi);
  private readonly shopLock = inject(ShopLockService);
  readonly i18n = inject(I18nService);

  readonly plans = signal<PlanOption[]>([]);
  readonly current = signal<PlanSummary | null>(null);
  readonly application = signal<PlanApplication | null>(null);
  readonly payments = signal<ShopPayment[]>([]);
  readonly shop = signal<Shop | null>(null);
  readonly bucket = signal<ProductBucket | null>(null);
  readonly pendingPayment = signal<ShopPayment | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly bucketBusy = signal(false);
  readonly preparing = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly trialDays = FREE_TRIAL_DAYS;
  readonly bucketAddonOptions = BUCKET_ADDON_OPTIONS;

  /** Toggle: browse plans vs payments landing. */
  readonly viewMode = signal<PlansViewMode>('plans');
  /** Plan the user is confirming before opening Payments. */
  readonly confirmPlanType = signal<PlanType | null>(null);
  /** Payments prep: plan from catalog (empty = bucket-only / skip plan). */
  readonly prepPlanType = signal<string>('');
  /** Shared add-on size for Payments dropdown + Plans chips. */
  readonly selectedBucketSlots = signal<BucketAddonSlots | null>(null);
  /** Breakdown after Prepare payment succeeds. */
  readonly prepSummary = signal<PrepPaymentSummary | null>(null);

  readonly packSize = computed(
    () => this.bucket()?.pack_size ?? DEFAULT_PACK_SIZE ?? PRODUCT_PACK_SIZE,
  );
  readonly packPrice = computed(
    () => this.bucket()?.pack_price_inr ?? DEFAULT_PACK_PRICE_INR ?? PRODUCT_PACK_PRICE_INR,
  );

  readonly prepPlanOptions = computed((): InlineSelectOption[] => {
    this.i18n.lang();
    const none: InlineSelectOption = {
      value: '',
      label: this.i18n.t('plans.prep.planNone'),
      hint: this.i18n.t('plans.prep.planNoneHint'),
    };
    const rows = this.plans().map((plan) => {
      const current = this.isCurrent(plan.type);
      const price =
        plan.price_inr === 0
          ? this.i18n.t('common.free')
          : `₹${plan.price_inr}`;
      return {
        value: plan.type,
        label: current
          ? `${plan.name} · ${this.i18n.t('plans.currentPlan')}`
          : `${plan.name} · ${price}`,
        hint: this.productLimitLabel(plan),
      } satisfies InlineSelectOption;
    });
    return [none, ...rows];
  });

  readonly prepBucketOptions = computed((): InlineSelectOption[] => {
    this.i18n.lang();
    const price = this.packPrice();
    const packSize = this.packSize();
    const none: InlineSelectOption = {
      value: '',
      label: this.i18n.t('plans.prep.bucketNone'),
      hint: this.i18n.t('plans.prep.bucketNoneHint'),
    };
    const rows = BUCKET_ADDON_OPTIONS.map((slots) => {
      const meta = BUCKET_ADDON_MAP[slots];
      const amount = meta.packs * price;
      return {
        value: String(slots),
        label: this.i18n.t('plans.prep.bucketLabel', {
          slots,
          packs: meta.packs,
          amount: `₹${amount}`,
        }),
        hint: this.i18n.t('plans.prep.bucketHint', {
          packs: meta.packs,
          packSize,
          billed: meta.billedSlots,
        }),
      } satisfies InlineSelectOption;
    });
    return [none, ...rows];
  });

  readonly prepSelectedPlan = computed(() => {
    const type = this.prepPlanType().trim();
    if (!type) {
      return null;
    }
    return this.plans().find((plan) => plan.type === type) ?? null;
  });

  /** Plan purchase amount — 0 when skipped or already current. */
  readonly prepPlanPrice = computed(() => {
    const plan = this.prepSelectedPlan();
    if (!plan || plan.type === 'free_trial' || this.isCurrent(plan.type)) {
      return 0;
    }
    return plan.price_inr ?? 0;
  });

  readonly prepWillPurchasePlan = computed(() => {
    const plan = this.prepSelectedPlan();
    return !!plan && plan.type !== 'free_trial' && !this.isCurrent(plan.type);
  });

  readonly prepPacks = computed(() => {
    const slots = this.selectedBucketSlots();
    return slots ? BUCKET_ADDON_MAP[slots].packs : 0;
  });

  readonly prepBilledSlots = computed(() => {
    const slots = this.selectedBucketSlots();
    return slots ? BUCKET_ADDON_MAP[slots].billedSlots : 0;
  });

  readonly prepBucketPrice = computed(() => this.prepPacks() * this.packPrice());

  readonly prepTotal = computed(() => this.prepPlanPrice() + this.prepBucketPrice());

  readonly canPreparePayment = computed(() => {
    if (!this.shop()?.id || this.preparing()) {
      return false;
    }
    return this.prepWillPurchasePlan() || this.prepPacks() > 0;
  });

  readonly bucketChipHint = computed(() => {
    this.i18n.lang();
    const slots = this.selectedBucketSlots();
    if (!slots) {
      return this.i18n.t('plans.pack.chipHint');
    }
    const meta = BUCKET_ADDON_MAP[slots];
    return this.i18n.t('plans.pack.chipSelected', {
      slots,
      packs: meta.packs,
      billed: meta.billedSlots,
    });
  });

  readonly shopReady = computed(() => {
    const shop = this.shop();
    return !!shop?.id && !!shop.name?.trim() && !!shop.city?.trim() && !!shop.locality?.trim();
  });

  /** Prefer shop-level plan, fall back to /plans/me. */
  readonly displayPlan = computed((): PlanSummary | null => {
    return this.shop()?.plan ?? this.current();
  });

  readonly isViewerMode = computed(() => {
    const shop = this.shop();
    return shop ? this.shopLock.isLocked(shop) : false;
  });

  readonly onWaitlist = computed(() => {
    const app = this.application();
    return !!app && String(app.status).toLowerCase() === 'pending';
  });

  /** FIFO queue: oldest at front (top). */
  readonly queueItems = computed((): PlanQueueItem[] => {
    this.i18n.lang();
    const items: PlanQueueItem[] = [];
    const app = this.application();
    if (app) {
      items.push({
        id: `waitlist-${app.id}`,
        kind: 'waitlist',
        title: this.i18n.t('plans.queue.waitlist', {
          plan: this.requestedPlanName(app),
        }),
        status: String(app.status),
        created_at: app.created_at,
        detail: app.shop_name?.trim() || app.switch_message || '',
      });
    }
    for (const payment of this.payments()) {
      const planLabel =
        payment.plan_type != null
          ? planDisplayName(payment.plan_type, this.plans())
          : payment.kind === 'product_pack'
            ? this.i18n.t('plans.queue.productPack')
            : payment.description || this.i18n.t('plans.tab.payments');
      items.push({
        id: `payment-${payment.id}`,
        kind: 'payment',
        title: this.i18n.t('plans.queue.payment', { label: planLabel }),
        status: payment.status,
        created_at: payment.created_at,
        detail: `₹${payment.amount_inr ?? 0}`,
      });
    }
    return items.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  });

  readonly paymentPlan = computed(() => {
    const payment = this.pendingPayment();
    if (!payment?.plan_type) {
      return this.confirmPlan();
    }
    return this.plans().find((plan) => plan.type === payment.plan_type) ?? this.confirmPlan();
  });

  readonly paymentAmount = computed(() => {
    const summary = this.prepSummary();
    if (summary) {
      return summary.total;
    }
    const payment = this.pendingPayment();
    if (payment && typeof payment.amount_inr === 'number') {
      return payment.amount_inr;
    }
    return this.paymentPlan()?.price_inr ?? 0;
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

  onPrepPlanChange(value: string): void {
    this.prepPlanType.set(value ?? '');
  }

  onPrepBucketChange(value: string): void {
    const parsed = Number(value);
    if (parsed === 40 || parsed === 80 || parsed === 120) {
      this.selectedBucketSlots.set(parsed);
      return;
    }
    this.selectedBucketSlots.set(null);
  }

  selectBucketSlots(slots: BucketAddonSlots): void {
    this.selectedBucketSlots.update((current) => (current === slots ? null : slots));
  }

  isBucketSlotSelected(slots: BucketAddonSlots): boolean {
    return this.selectedBucketSlots() === slots;
  }

  /**
   * Payments prep: purchase selected plan (if not current) and/or bucket packs,
   * then land on pending payments with live totals.
   */
  preparePayment(): void {
    if (!this.canPreparePayment()) {
      return;
    }
    const shop = this.shop();
    if (!shop?.id) {
      this.error.set('Add your shop name, city, and locality on Overview before preparing payment.');
      return;
    }
    if (!shop.city?.trim() || !shop.locality?.trim()) {
      this.error.set(
        'Your shop needs a city and locality before you can prepare payment. Update them on Overview.',
      );
      return;
    }

    const willPlan = this.prepWillPurchasePlan();
    const plan = this.prepSelectedPlan();
    const packs = this.prepPacks();
    const slots = this.selectedBucketSlots();
    const planPrice = this.prepPlanPrice();
    const bucketPrice = this.prepBucketPrice();
    const billedSlots = this.prepBilledSlots();
    const total = this.prepTotal();

    this.preparing.set(true);
    this.error.set('');
    this.success.set('');

    const plan$: Observable<ShopPayment | null> = willPlan && plan
      ? this.shopsApi.purchasePlan(shop.id, plan.type).pipe(
          catchError(() => {
            const now = new Date().toISOString();
            const fallback: ShopPayment = {
              id: `local-${plan.type}`,
              store_id: shop.id,
              owner_user_id: '',
              kind: 'plan',
              plan_type: plan.type,
              amount_inr: plan.price_inr ?? 0,
              currency: 'INR',
              status: 'pending',
              description: `${plan.name} plan`,
              created_at: now,
              updated_at: now,
            };
            return of(fallback);
          }),
        )
      : of(null);

    const packs$: Observable<ShopPayment | ProductBucket | null> =
      packs > 0
        ? this.bucketApi.purchasePacks(packs).pipe(catchError(() => of(null)))
        : of(null);

    forkJoin({ planPayment: plan$, packResult: packs$ })
      .pipe(finalize(() => this.preparing.set(false)))
      .subscribe({
        next: ({ planPayment, packResult }) => {
          let packPayment: ShopPayment | null = null;
          if (packResult) {
            if (this.isBucket(packResult)) {
              this.bucket.set(packResult);
            } else {
              packPayment = packResult;
              this.prependPayment(packPayment);
            }
          }
          if (planPayment) {
            this.prependPayment(planPayment);
          }

          const pending = planPayment ?? packPayment;
          if (!pending) {
            this.error.set(
              packs > 0
                ? 'Could not start pack payment. Try again or choose a plan.'
                : 'Could not prepare payment.',
            );
            return;
          }

          this.pendingPayment.set(pending);

          const bucketLabel = slots
            ? this.i18n.t('plans.prep.bucketShort', { slots, packs })
            : this.i18n.t('plans.prep.bucketNone');

          this.prepSummary.set({
            planName: willPlan && plan ? plan.name : this.i18n.t('plans.prep.planSkipped'),
            planPrice,
            bucketLabel,
            bucketPrice,
            packs,
            billedSlots,
            requestedSlots: slots,
            total,
          });

          this.viewMode.set('payments');
          this.success.set(
            this.i18n.t('plans.prep.success', {
              total: `₹${total}`,
            }),
          );
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not prepare payment.')),
      });
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.confirmPlanType.set(null);

    forkJoin({
      plans: this.api.list().pipe(catchError(() => of([] as PlanOption[]))),
      application: this.api.myApplication().pipe(catchError(() => of(null))),
      shops: this.currentShop.refresh().pipe(
        map(() => this.currentShop.shops()),
        catchError(() => of([] as Shop[])),
      ),
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
          const shop = active ?? shops[0] ?? null;
          this.shop.set(shop);
          this.current.set(current);
          this.bucket.set(bucket);
          this.loadPayments(shop?.id);
          if (this.pendingPayment()) {
            this.viewMode.set('payments');
          }
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load plans.')),
      });
  }

  /**
   * First step: confirm plan before opening Payments with amount.
   */
  requestJoinWaitlist(planType: PlanType): void {
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

  /** User approved — open Payments with selected plan + amount (gateway later). */
  joinWaitlist(): void {
    const planType = this.confirmPlanType();
    if (!planType || planType === 'free_trial') {
      return;
    }
    const shop = this.shop();
    const plan = this.plans().find((row) => row.type === planType);
    if (!shop?.id) {
      this.error.set('Add your shop name, city, and locality on Overview before choosing a plan.');
      this.confirmPlanType.set(null);
      return;
    }
    if (!shop.city?.trim() || !shop.locality?.trim()) {
      this.error.set(
        'Your shop needs a city and locality before you can open Payments. Update them on Overview.',
      );
      this.confirmPlanType.set(null);
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.shopsApi
      .purchasePlan(shop.id, planType)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (payment) => {
          this.pendingPayment.set(payment);
          this.prependPayment(payment);
          this.confirmPlanType.set(null);
          this.prepPlanType.set(planType);
          this.prepSummary.set({
            planName: plan?.name ?? planType,
            planPrice: payment.amount_inr ?? plan?.price_inr ?? 0,
            bucketLabel: this.i18n.t('plans.prep.bucketNone'),
            bucketPrice: 0,
            packs: 0,
            billedSlots: 0,
            requestedSlots: null,
            total: payment.amount_inr ?? plan?.price_inr ?? 0,
          });
          this.viewMode.set('payments');
          this.success.set(
            `Payments opened for ${plan?.name ?? planType} · ₹${payment.amount_inr ?? plan?.price_inr ?? 0}.`,
          );
        },
        error: () => {
          // Fallback when purchase endpoint is unavailable — still land on Payments with amount.
          const amount = plan?.price_inr ?? 0;
          const now = new Date().toISOString();
          const payment: ShopPayment = {
            id: `local-${planType}`,
            store_id: shop.id,
            owner_user_id: '',
            kind: 'plan',
            plan_type: planType,
            amount_inr: amount,
            currency: 'INR',
            status: 'pending',
            description: `${plan?.name ?? planType} plan`,
            created_at: now,
            updated_at: now,
          };
          this.pendingPayment.set(payment);
          this.prependPayment(payment);
          this.confirmPlanType.set(null);
          this.prepPlanType.set(planType);
          this.prepSummary.set({
            planName: plan?.name ?? planType,
            planPrice: amount,
            bucketLabel: this.i18n.t('plans.prep.bucketNone'),
            bucketPrice: 0,
            packs: 0,
            billedSlots: 0,
            requestedSlots: null,
            total: amount,
          });
          this.viewMode.set('payments');
          this.success.set(`Payments opened for ${plan?.name ?? planType} · ₹${amount}.`);
        },
      });
  }

  /** Buy selected product packs (40/80/120 → 1/2/3 packs) via product-bucket payment. */
  purchaseProductPack(): void {
    if (!this.shop()?.id) {
      this.error.set('Select a shop before buying a product pack.');
      return;
    }
    const packs = this.prepPacks() || 1;
    const slots = this.selectedBucketSlots();
    const billed = this.prepBilledSlots() || this.packSize();
    this.bucketBusy.set(true);
    this.error.set('');
    this.success.set('');
    this.bucketApi
      .purchasePacks(packs)
      .pipe(finalize(() => this.bucketBusy.set(false)))
      .subscribe({
        next: (result) => {
          if (!result) {
            return;
          }
          if (this.isBucket(result)) {
            this.bucket.set(result);
            this.success.set(
              `Added ${billed} product slots (${packs} pack${packs === 1 ? '' : 's'}). Capacity is now ${result.capacity ?? '—'}.`,
            );
            return;
          }
          const payment = result as ShopPayment;
          this.prependPayment(payment);
          if (payment.status === 'pending' && payment.id) {
            this.pendingPayment.set(payment);
            this.prepSummary.set({
              planName: this.i18n.t('plans.prep.planSkipped'),
              planPrice: 0,
              bucketLabel: this.i18n.t('plans.prep.bucketShort', {
                slots: slots ?? billed,
                packs,
              }),
              bucketPrice: packs * this.packPrice(),
              packs,
              billedSlots: billed,
              requestedSlots: slots,
              total: packs * this.packPrice(),
            });
            this.viewMode.set('payments');
            this.success.set(
              this.i18n.t('plans.prep.success', { total: `₹${packs * this.packPrice()}` }),
            );
            return;
          }
          this.reloadBucket();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not purchase a product pack.')),
      });
  }

  requestedPlanName(app: PlanApplication): string {
    return planDisplayName(app.requested_plan_type, this.plans());
  }

  productLimitLabel(plan: PlanOption | PlanSummary): string {
    this.i18n.lang();
    if (plan.profile_only || plan.max_products === 0) {
      return this.i18n.t('plans.limit.profileOnly');
    }
    if (plan.max_products === null) {
      return this.i18n.t('plans.limit.unlimited');
    }
    if (plan.type === 'free_trial') {
      const days = 'duration_days' in plan ? (plan.duration_days ?? this.trialDays) : this.trialDays;
      return this.i18n.t('plans.limit.trial', { count: plan.max_products, days });
    }
    return this.i18n.t('plans.limit.yearly', { count: plan.max_products });
  }

  isCurrent(planType: PlanType): boolean {
    const current = this.displayPlan();
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

  planStatusHeadline(plan: PlanSummary): string {
    this.i18n.lang();
    if (plan.in_grace_period || plan.status === 'grace_period') {
      return this.i18n.t('plans.status.grace');
    }
    if (plan.status === 'expired' || plan.status === 'deactivated') {
      return this.i18n.t('plans.status.expired');
    }
    if (plan.status === 'cancelled') {
      return this.i18n.t('plans.status.cancelled');
    }
    if (plan.type === 'free_trial' && plan.is_active) {
      return this.i18n.t('plans.status.trial');
    }
    if (plan.is_active) {
      return this.i18n.t('plans.status.active');
    }
    return plan.status;
  }

  private loadPayments(storeId: string | undefined): void {
    if (!storeId?.trim()) {
      this.payments.set([]);
      return;
    }
    this.paymentsApi.list(storeId).subscribe({
      next: (rows) => {
        // API may return newest-first; queueItems sorts ascending for FIFO display.
        this.payments.set(Array.isArray(rows) ? rows : []);
        const pending = (rows ?? []).find(
          (row) =>
            row.status === 'pending' &&
            (row.kind === 'plan' || row.kind === 'product_pack'),
        );
        if (pending && !this.pendingPayment()) {
          this.pendingPayment.set(pending);
        }
      },
      error: () => this.payments.set([]),
    });
  }

  private prependPayment(payment: ShopPayment): void {
    this.payments.update((rows) => {
      const without = rows.filter((row) => row.id !== payment.id);
      return [payment, ...without];
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
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
