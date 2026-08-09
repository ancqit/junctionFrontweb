import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { FREE_TRIAL_DAYS, PlanOption, PlanSummary, PlanType } from '../../core/models';
import { PlanApplication, planDisplayName, PlansApi } from '../../core/plans.api';
import { Shop, ShopsApi } from '../../core/shops.api';

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

  readonly shopReady = computed(() => {
    const shop = this.shop();
    return !!shop?.id && !!shop.name?.trim() && !!shop.city?.trim() && !!shop.locality?.trim();
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.list().subscribe({
      next: (plans) => this.plans.set(plans),
      error: () => this.plans.set([]),
    });
    this.api.myApplication().subscribe({
      next: (app) => this.application.set(app),
    });
    this.shopsApi.list().subscribe({
      next: (shops) => this.shop.set(shops[0] ?? null),
      error: () => this.shop.set(null),
    });
    this.api
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (state) => this.current.set(state),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load your plan.')),
      });
  }

  /** Join waitlist for this plan; backend stores shop name + city + locality from the shop. */
  selectPlan(planType: PlanType): void {
    if (planType === 'free_trial') {
      this.error.set('Free trial starts automatically when you create an account.');
      return;
    }
    const shop = this.shop();
    if (!shop?.id) {
      this.error.set('Add your shop name, city, and locality on Overview before joining a plan waitlist.');
      return;
    }
    if (!shop.city?.trim() || !shop.locality?.trim()) {
      this.error.set(
        'Your shop needs a city and locality before you can join the waitlist. Update them on Overview.',
      );
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
          const name = this.requestedPlanName(app);
          this.success.set(
            `You’re on the waitlist for ${name}. Application forwarded with ${app.shop_name} · ${app.location.locality}, ${app.location.city}.`,
          );
          // Refresh catalog + current plan from API after selection/application.
          this.api.list().subscribe({
            next: (plans) => this.plans.set(plans),
          });
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
    return `Up to ${plan.max_products} products · yearly`;
  }

  isCurrent(planType: PlanType): boolean {
    const current = this.current();
    return !!current && current.is_active && current.type === planType;
  }

  canSelect(plan: PlanOption): boolean {
    if (plan.type === 'free_trial') {
      return false;
    }
    if (this.application()?.status === 'pending') {
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
