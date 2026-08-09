import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FREE_TRIAL_DAYS, PlanOption, PlanSummary, PlanType } from '../../core/models';
import { PlansApi } from '../../core/plans.api';

@Component({
  selector: 'app-plans',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class PlansPage implements OnInit {
  private readonly api = inject(PlansApi);

  readonly plans = signal<PlanOption[]>([]);
  readonly current = signal<PlanSummary | null>(null);
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
        next: (state) => this.current.set(state),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load your plan.')),
      });
  }

  selectPlan(planType: PlanType): void {
    if (planType === 'free_trial') {
      this.error.set('Free trial starts automatically when you create an account.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.api
      .select(planType)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (state) => {
          this.current.set(state);
          this.success.set(`${state.name} is now active.`);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not select this plan.')),
      });
  }

  productLimitLabel(plan: PlanOption): string {
    if (plan.profile_only || plan.max_products === 0) {
      return 'Profile only';
    }
    if (plan.max_products === null) {
      return 'More than 150 products';
    }
    if (plan.type === 'free_trial') {
      return `Up to ${plan.max_products} products for ${plan.duration_days ?? this.trialDays} days`;
    }
    return `Up to ${plan.max_products} products`;
  }

  isCurrent(planType: PlanType): boolean {
    const current = this.current();
    return !!current && current.is_active && current.type === planType;
  }

  canSelect(plan: PlanOption): boolean {
    if (plan.type === 'free_trial') {
      return false;
    }
    return !this.isCurrent(plan.type);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
