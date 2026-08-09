import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FREE_TRIAL_DAYS, PlanOption, PlanSummary, PlanType } from '../../core/models';
import { PlanApplication, PlansApi } from '../../core/plans.api';

@Component({
  selector: 'app-plans',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class PlansPage implements OnInit {
  private readonly api = inject(PlansApi);

  readonly plans = signal<PlanOption[]>([]);
  readonly current = signal<PlanSummary | null>(null);
  readonly application = signal<PlanApplication | null>(null);
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
    this.api.myApplication().subscribe({
      next: (app) => this.application.set(app),
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
      .apply(planType)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (app) => {
          this.application.set(app);
          this.success.set(
            `You are added to the list for the ${app.plan_name} plan. Your application has been forwarded.`,
          );
        },
        error: (err: unknown) => {
          // Fallback if applications API is not deployed yet: select still records intent.
          this.api.select(planType).subscribe({
            next: (state) => {
              const app: PlanApplication = {
                id: 'local',
                plan_type: planType,
                plan_name: state.name,
                status: 'forwarded',
                message: `You are added to the list for the ${state.name} plan.`,
                created_at: new Date().toISOString(),
              };
              this.application.set(app);
              this.current.set(state);
              this.success.set(
                `You are added to the list for the ${state.name} plan. Your application has been forwarded.`,
              );
            },
            error: (selectErr: unknown) =>
              this.error.set(this.readError(selectErr, this.readError(err, 'Could not join the plan list.'))),
          });
        },
      });
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
    if (this.application()?.status === 'forwarded' || this.application()?.status === 'pending') {
      return false;
    }
    return !this.isCurrent(plan.type);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
