import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { PLAN_CATALOG, PlanOption, PlanSummary, PlanType } from './models';

/** Matches junctionBack plan_applications.ApplicationStatus */
export type PlanApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PlanApplicationLocation {
  city: string;
  locality: string;
}

export interface PlanApplicantIdentity {
  display_name: string;
  phone_number?: string | null;
  email?: string | null;
}

/** Matches junctionBack plan_applications.PlanApplication (waitlist entry). */
export interface PlanApplication {
  id: string;
  user_id: string;
  shop_id: string;
  shop_name: string;
  identity: PlanApplicantIdentity;
  location: PlanApplicationLocation;
  requested_plan_type: PlanType;
  current_plan_type: PlanType;
  is_plan_switch: boolean;
  switch_message: string;
  status: PlanApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface PlanApplyPreview {
  requested_plan_type: PlanType;
  requested_plan_name: string;
  current_plan_type: PlanType;
  current_plan_name: string;
  is_plan_switch: boolean;
  message: string;
}

/** Matches junctionBack PlansListResponse. */
interface PlansListResponse {
  plans: PlanOption[];
}

/** Force catalog fields to match junctionBack (overrides stale API payloads). */
export function alignPlanCatalog(plans: PlanOption[]): PlanOption[] {
  const byType = new Map(PLAN_CATALOG.map((plan) => [plan.type, plan]));
  const aligned = (plans.length ? plans : PLAN_CATALOG).map((plan) => {
    const canonical = byType.get(plan.type);
    if (!canonical) {
      return plan;
    }
    return {
      ...plan,
      name: canonical.name,
      price_inr: canonical.price_inr,
      max_products: canonical.max_products,
      profile_only: canonical.profile_only,
      description: canonical.description,
      duration_days: canonical.duration_days,
    };
  });
  for (const canonical of PLAN_CATALOG) {
    if (!aligned.some((plan) => plan.type === canonical.type)) {
      aligned.push(canonical);
    }
  }
  return aligned;
}

@Injectable({ providedIn: 'root' })
export class PlansApi {
  private readonly api = inject(BackOfficeApiService);

  /** Public `GET /plans` → `{ plans: PlanOption[] }`. */
  list(): Observable<PlanOption[]> {
    return this.api.get<PlansListResponse | PlanOption[]>('/plans', undefined, 'none').pipe(
      map((res) => alignPlanCatalog(Array.isArray(res) ? res : (res?.plans ?? PLAN_CATALOG))),
      catchError(() => of(PLAN_CATALOG)),
    );
  }

  me(): Observable<PlanSummary> {
    return this.api.get<PlanSummary>('/plans/me');
  }

  select(planType: PlanType): Observable<PlanSummary> {
    return this.api.post<PlanSummary>('/plans/select', { plan_type: planType });
  }

  /**
   * Join the waitlist — prefer junctionBack `POST /waitlist`
   * (alias of `/plans/apply`).
   */
  apply(planType: PlanType, shopId: string): Observable<PlanApplication> {
    const body = { plan_type: planType, shop_id: shopId };
    return this.api.post<PlanApplication>('/waitlist', body).pipe(
      catchError(() => this.api.post<PlanApplication>('/plans/apply', body)),
    );
  }

  preview(planType: PlanType): Observable<PlanApplyPreview> {
    return this.api.get<PlanApplyPreview>('/waitlist/preview', { plan_type: planType }).pipe(
      catchError(() =>
        this.api.get<PlanApplyPreview>('/plans/apply/preview', { plan_type: planType }),
      ),
    );
  }

  /** Pending waitlist entry — prefer `GET /waitlist/me`. */
  myApplication(): Observable<PlanApplication | null> {
    return this.api.get<PlanApplication | null>('/waitlist/me').pipe(
      catchError(() =>
        this.api.get<PlanApplication | null>('/plans/applications/me').pipe(catchError(() => of(null))),
      ),
      map((app) => app ?? null),
    );
  }
}

export function planDisplayName(planType: PlanType, catalog: PlanOption[] = PLAN_CATALOG): string {
  return catalog.find((p) => p.type === planType)?.name ?? planType;
}
