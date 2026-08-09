import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { PLAN_CATALOG, PlanOption, PlanSummary, PlanType } from './models';

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
}
