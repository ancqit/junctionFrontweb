import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

export type PlanId = 'starter' | 'growth' | 'premium';
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired';

export interface PlanCatalogItem {
  id: PlanId;
  name: string;
  price_inr: number;
  product_limit: number | null;
  description: string;
  features: string[];
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  plan_id?: PlanId | null;
  plan_name?: string | null;
  product_limit?: number | null;
  price_inr?: number | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  trial_days_total: number;
  trial_days_remaining?: number | null;
  selected_at?: string | null;
}

export const FREE_TRIAL_DAYS = 15;

export const PLAN_CATALOG: PlanCatalogItem[] = [
  {
    id: 'starter',
    name: 'Starter',
    price_inr: 0,
    product_limit: 0,
    description: 'Get a Junction profile and explore the workspace.',
    features: ['Store profile', 'Overview access', 'Upgrade anytime'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price_inr: 299,
    product_limit: 100,
    description: 'Add up to 100 products and run your catalog.',
    features: ['Up to 100 products', 'Orders & billing', 'Employee records'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price_inr: 599,
    product_limit: null,
    description: 'Add more than 150 products with full store operations.',
    features: ['More than 150 products', 'Orders & billing', 'Priority catalog tools'],
  },
];

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly api = inject(ApiService);

  list(): Observable<PlanCatalogItem[]> {
    return this.api.get<PlanCatalogItem[]>('/plans').pipe(catchError(() => of(PLAN_CATALOG)));
  }

  startTrial(): Observable<SubscriptionState> {
    return this.api.post<SubscriptionState>('/plans/trial/start', {});
  }

  select(planId: PlanId): Observable<SubscriptionState> {
    return this.api.post<SubscriptionState>('/plans/select', { plan_id: planId });
  }
}
