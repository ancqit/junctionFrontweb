import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { PLAN_CATALOG, PlanOption, PlanSummary, PlanType } from './models';

/** junctionBack plan application / waitlist entry after choosing a paid plan. */
export interface PlanApplication {
  id: string;
  plan_type: PlanType;
  plan_name: string;
  status: 'forwarded' | 'pending' | 'approved' | 'rejected' | string;
  message?: string | null;
  created_at: string;
  updated_at?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PlansApi {
  private readonly api = inject(BackOfficeApiService);

  list(): Observable<PlanOption[]> {
    return this.api.get<PlanOption[]>('/plans').pipe(catchError(() => of(PLAN_CATALOG)));
  }

  me(): Observable<PlanSummary> {
    return this.api.get<PlanSummary>('/plans/me');
  }

  select(planType: PlanType): Observable<PlanSummary> {
    return this.api.post<PlanSummary>('/plans/select', { plan_type: planType });
  }

  /** Add the user to the plan application list (does not activate immediately). */
  apply(planType: PlanType): Observable<PlanApplication> {
    return this.api.post<PlanApplication>('/plans/applications', { plan_type: planType });
  }

  myApplication(): Observable<PlanApplication | null> {
    return this.api.get<PlanApplication | null>('/plans/applications/me').pipe(
      catchError(() => of(null)),
    );
  }
}
