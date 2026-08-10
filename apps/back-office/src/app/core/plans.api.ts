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

/** Align Starter with junctionBack: profile + 10 products (overrides stale API payloads). */
export function alignPlanCatalog(plans: PlanOption[]): PlanOption[] {
  const starter = PLAN_CATALOG.find((plan) => plan.type === 'starter');
  if (!starter) {
    return plans;
  }
  return plans.map((plan) =>
    plan.type === 'starter'
      ? {
          ...plan,
          max_products: starter.max_products,
          profile_only: starter.profile_only,
          description: starter.description,
          duration_days: plan.duration_days ?? starter.duration_days,
        }
      : plan,
  );
}

@Injectable({ providedIn: 'root' })
export class PlansApi {
  private readonly api = inject(BackOfficeApiService);

  /** Public `GET /plans` → `{ plans: PlanOption[] }`. */
  list(): Observable<PlanOption[]> {
    return this.api.get<PlansListResponse | PlanOption[]>('/plans').pipe(
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
   * Join the waitlist for a plan. Backend snapshots shop_name, city, and locality
   * from the shop record (shop must already have city + locality).
   */
  apply(planType: PlanType, shopId: string): Observable<PlanApplication> {
    return this.api.post<PlanApplication>('/plans/apply', {
      plan_type: planType,
      shop_id: shopId,
    });
  }

  preview(planType: PlanType): Observable<PlanApplyPreview> {
    return this.api.get<PlanApplyPreview>('/plans/apply/preview', { plan_type: planType });
  }

  myApplication(): Observable<PlanApplication | null> {
    return this.api.get<PlanApplication | null>('/plans/applications/me').pipe(
      catchError(() =>
        this.api.get<PlanApplication | null>('/waitlist/me').pipe(catchError(() => of(null))),
      ),
      map((app) => app ?? null),
    );
  }
}

export function planDisplayName(planType: PlanType, catalog: PlanOption[] = PLAN_CATALOG): string {
  return catalog.find((p) => p.type === planType)?.name ?? planType;
}
