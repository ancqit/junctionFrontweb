import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import {
  FREE_TRIAL_DAYS,
  PlanCatalogItem,
  PlanId,
  SubscriptionState,
} from '../../core/models';
import { PlansApi } from '../../core/plans.api';

@Component({
  selector: 'app-plans',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class PlansPage implements OnInit {
  private readonly api = inject(PlansApi);

  readonly plans = signal<PlanCatalogItem[]>([]);
  readonly subscription = signal<SubscriptionState | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly trialDays = FREE_TRIAL_DAYS;

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
    this.api
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (state) => this.subscription.set(state),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load your plan.')),
      });
  }

  startTrial(): void {
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.api
      .startTrial()
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (state) => {
          this.subscription.set(state);
          this.success.set(
            `Free trial started. ${state.trial_days_remaining ?? this.trialDays} days remaining.`,
          );
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not start the free trial.')),
      });
  }

  selectPlan(planId: PlanId): void {
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.api
      .select(planId)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (state) => {
          this.subscription.set(state);
          this.success.set(`${state.plan_name ?? 'Plan'} is now active.`);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not select this plan.')),
      });
  }

  productLimitLabel(plan: PlanCatalogItem): string {
    if (plan.product_limit === null) {
      return 'More than 150 products';
    }
    if (plan.product_limit === 0) {
      return 'Profile only';
    }
    return `Up to ${plan.product_limit} products`;
  }

  isCurrent(planId: PlanId): boolean {
    const sub = this.subscription();
    if (!sub) {
      return false;
    }
    if (sub.status === 'trial') {
      return planId === 'premium';
    }
    return sub.status === 'active' && sub.plan_id === planId;
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
