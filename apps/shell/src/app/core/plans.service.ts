import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

export type PlanType = 'free_trial' | 'starter' | 'growth' | 'premium';
export type PlanStatus = 'active' | 'grace_period' | 'expired' | 'cancelled' | 'deactivated';

export interface PlanOption {
  type: PlanType;
  name: string;
  price_inr: number;
  max_products: number | null;
  profile_only: boolean;
  description: string;
  duration_days?: number | null;
}

export interface PlanSummary {
  type: PlanType;
  status: PlanStatus;
  name: string;
  price_inr: number;
  max_products: number | null;
  profile_only: boolean;
  description: string;
  started_at: string;
  ends_at?: string | null;
  days_remaining?: number | null;
  is_active: boolean;
  trial_used: boolean;
  selected_plan_type?: PlanType | null;
  in_grace_period?: boolean;
  grace_ends_at?: string | null;
}

/** Matches junctionBack PlansListResponse. */
interface PlansListResponse {
  plans: PlanOption[];
}

export const FREE_TRIAL_DAYS = 15;
export const PAID_PLAN_DAYS = 365;

/** Matches junctionBack `PLAN_CATALOG` (shop plans · yearly). */
export const PLAN_CATALOG: PlanOption[] = [
  {
    type: 'free_trial',
    name: 'Free Trial',
    price_inr: 0,
    max_products: 40,
    profile_only: false,
    description: 'Shop profile with up to 40 products for 15 days',
    duration_days: FREE_TRIAL_DAYS,
  },
  {
    type: 'starter',
    name: 'Starter',
    price_inr: 999,
    max_products: 10,
    profile_only: false,
    description: 'Shop profile with up to 10 products for 1 year (INR 999)',
    duration_days: PAID_PLAN_DAYS,
  },
  {
    type: 'growth',
    name: 'Growth',
    price_inr: 2999,
    max_products: 80,
    profile_only: false,
    description: 'Shop profile with up to 80 products for 1 year (INR 2999)',
    duration_days: PAID_PLAN_DAYS,
  },
  {
    type: 'premium',
    name: 'Premium',
    price_inr: 599,
    max_products: 150,
    profile_only: false,
    description: 'Shop profile with up to 150 products for 1 year (INR 599)',
    duration_days: PAID_PLAN_DAYS,
  },
];

/** Extra product pack after plan allowance is used (junctionBack product_bucket). */
export const PRODUCT_PACK_SIZE = 40;
export const PRODUCT_PACK_PRICE_INR = 999;

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
  // Ensure every catalog plan is present even if API omits some.
  for (const canonical of PLAN_CATALOG) {
    if (!aligned.some((plan) => plan.type === canonical.type)) {
      aligned.push(canonical);
    }
  }
  return aligned;
}

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly api = inject(ApiService);

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
}
