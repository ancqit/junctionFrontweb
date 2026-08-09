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

export const PLAN_CATALOG: PlanOption[] = [
  {
    type: 'free_trial',
    name: 'Free Trial',
    price_inr: 0,
    max_products: 150,
    profile_only: false,
    description: 'Try all features free for 15 days',
    duration_days: FREE_TRIAL_DAYS,
  },
  {
    type: 'starter',
    name: 'Starter',
    price_inr: 0,
    max_products: 0,
    profile_only: true,
    description: 'Profile only · billed yearly',
    duration_days: PAID_PLAN_DAYS,
  },
  {
    type: 'growth',
    name: 'Growth',
    price_inr: 399,
    max_products: 100,
    profile_only: false,
    description: 'Add up to 100 products · billed yearly',
    duration_days: PAID_PLAN_DAYS,
  },
  {
    type: 'premium',
    name: 'Premium',
    price_inr: 599,
    max_products: null,
    profile_only: false,
    description: 'Add more than 150 products · billed yearly',
    duration_days: PAID_PLAN_DAYS,
  },
];

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly api = inject(ApiService);

  /** Public `GET /plans` → `{ plans: PlanOption[] }`. */
  list(): Observable<PlanOption[]> {
    return this.api.get<PlansListResponse | PlanOption[]>('/plans').pipe(
      map((res) => (Array.isArray(res) ? res : (res?.plans ?? PLAN_CATALOG))),
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
