import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FREE_TRIAL_DAYS, PlanOption, PlanSummary, PlanType } from '../../core/models';
import { PlanApplication, planDisplayName, PlansApi } from '../../core/plans.api';
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

  readonly plans = signal<PlanOption[]>([]);
  readonly current = signal<PlanSummary | null>(null);
  readonly application = signal<PlanApplication | null>(null);
  readonly shop = signal<Shop | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly trialDays = FREE_TRIAL_DAYS;

  /** Toggle: browse plans vs your waitlist status. */
  readonly viewMode = signal<PlansViewMode>('plans');
  /** Plan the user is confirming before joining the waitlist. */
  readonly confirmPlanType = signal<PlanType | null>(null);

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
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ plans, application, shops, current }) => {
          this.plans.set(plans.length ? plans : []);
          this.application.set(application);
          this.shop.set(shops[0] ?? null);
          this.current.set(current);
          // Always check waitlist — if pending, land on waitlist view.
          this.viewMode.set(application?.status === 'pending' ? 'waitlist' : 'plans');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load plans.')),
      });
  }

  /**
   * First step: tell the user they will be added to the waitlist.
   * Confirm → `joinWaitlist()` posts to `/waitlist`.
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

  /** User approved the waitlist message — join via API and toggle to waitlist view. */
  joinWaitlist(): void {
    const planType = this.confirmPlanType();
    if (!planType || planType === 'free_trial') {
      return;
    }
    const shop = this.shop();
    if (!shop?.id) {
      this.error.set('Add your shop name, city, and locality on Overview before joining a plan waitlist.');
      this.confirmPlanType.set(null);
      return;
    }
    if (!shop.city?.trim() || !shop.locality?.trim()) {
      this.error.set(
        'Your shop needs a city and locality before you can join the waitlist. Update them on Overview.',
      );
      this.confirmPlanType.set(null);
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.api
      .apply(planType, shop.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (app) => {
          this.application.set(app);
          this.confirmPlanType.set(null);
          this.viewMode.set('waitlist');
          const name = this.requestedPlanName(app);
          this.success.set(
            `You’re on the waitlist for ${name}. Shop forwarded: ${app.shop_name} · ${app.location.locality}, ${app.location.city}.`,
          );
          this.api.me().subscribe({
            next: (state) => this.current.set(state),
            error: () => undefined,
          });
          this.api.myApplication().subscribe({
            next: (latest) => this.application.set(latest ?? app),
          });
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not join the plan waitlist.')),
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
      return 'More than 150 products · yearly';
    }
    if (plan.type === 'free_trial') {
      const days = 'duration_days' in plan ? (plan.duration_days ?? this.trialDays) : this.trialDays;
      return `Up to ${plan.max_products} products for ${days} days`;
    }
    if (plan.type === 'starter') {
      return `Profile and up to ${plan.max_products} products · yearly`;
    }
    return `Up to ${plan.max_products} products · yearly`;
  }

  isCurrent(planType: PlanType): boolean {
    const current = this.current();
    return !!current && current.is_active && current.type === planType;
  }

  canSelect(plan: PlanOption | undefined): boolean {
    if (!plan || plan.type === 'free_trial') {
      return false;
    }
    if (this.onWaitlist()) {
      return false;
    }
    if (!this.shopReady()) {
      return false;
    }
    return !this.isCurrent(plan.type);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
