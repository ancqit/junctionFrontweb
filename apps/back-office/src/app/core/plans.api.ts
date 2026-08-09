import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import {
  FREE_TRIAL_DAYS,
  PLAN_CATALOG,
  PlanCatalogItem,
  PlanId,
  SubscriptionState,
} from './models';

@Injectable({ providedIn: 'root' })
export class PlansApi {
  private readonly api = inject(BackOfficeApiService);

  list(): Observable<PlanCatalogItem[]> {
    return this.api.get<PlanCatalogItem[]>('/plans').pipe(catchError(() => of(PLAN_CATALOG)));
  }

  me(): Observable<SubscriptionState> {
    return this.api.get<SubscriptionState>('/plans/me').pipe(
      catchError(() =>
        of({
          status: 'none' as const,
          trial_days_total: FREE_TRIAL_DAYS,
          trial_days_remaining: null,
        }),
      ),
    );
  }

  startTrial(): Observable<SubscriptionState> {
    return this.api.post<SubscriptionState>('/plans/trial/start', {});
  }

  select(planId: PlanId): Observable<SubscriptionState> {
    return this.api.post<SubscriptionState>('/plans/select', { plan_id: planId });
  }
}
