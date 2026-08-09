import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { PlanSummary } from './models';
import { PlansApi } from './plans.api';

@Injectable({ providedIn: 'root' })
export class PlanAccessService {
  private readonly plansApi = inject(PlansApi);

  readonly plan = signal<PlanSummary | null>(null);
  readonly loading = signal(true);
  /** Account locked after grace/free-trial ends until a paid plan is selected. */
  readonly locked = signal(false);

  refresh(): Observable<PlanSummary | null> {
    this.loading.set(true);
    return this.plansApi.me().pipe(
      catchError(() => of(null)),
      tap((plan) => {
        this.plan.set(plan);
        this.locked.set(this.isAccountLocked(plan));
        this.loading.set(false);
      }),
    );
  }

  markUnlocked(plan: PlanSummary): void {
    this.plan.set(plan);
    this.locked.set(this.isAccountLocked(plan));
  }

  private isAccountLocked(plan: PlanSummary | null): boolean {
    if (!plan) {
      return false;
    }
    // junctionBack grace period = free trial (PLAN_TRIAL_DAYS).
    // After it ends, status becomes expired / is_active=false while login still works.
    return plan.status === 'expired' || plan.is_active === false;
  }
}
