import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { PlanSummary, PlanType } from './models';
import { ShopPayment } from './payments.api';

/** junctionBack `Shop` (`GET /shops`) — plan lives on the shop (multi-shop model). */
export interface Shop {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  city: string;
  locality: string;
  /** Street / shop address line (junctionBack `address`). */
  address?: string | null;
  open_time?: string | null;
  closed_time?: string | null;
  is_open?: boolean;
  /** When true, junction.today may show phone_number. */
  show_phone?: boolean;
  /** When true, back-office runs in viewer mode for this shop. */
  is_locked?: boolean;
  /** Why the shop is locked (`manual` toggle or `plan_expired`). */
  lock_reason?: 'manual' | 'plan_expired' | null;
  shop_type?: string | null;
  shop_type_label?: string | null;
  plan?: PlanSummary | null;
  created_at: string;
  updated_at: string;
}

/** junctionBack `ShopTypeInfo` from `GET /shops/types`. */
export interface ShopTypeInfo {
  value: string;
  label: string;
  category: string;
  group?: string | null;
  description: string;
}

/** junctionBack `ShopCreate` / `ShopUpdate` fields used by back office. */
export interface ShopWrite {
  name: string;
  city: string;
  locality: string;
  address?: string | null;
  open_time?: string;
  closed_time?: string;
  is_open?: boolean;
  show_phone?: boolean;
  is_locked?: boolean;
  lock_reason?: 'manual' | 'plan_expired' | null;
}

/** junctionBack `ShopOpenStatusUpdate` — `PUT /shops/open-status`. */
export interface ShopOpenStatusUpdate {
  name: string;
  is_open: boolean;
}

/** junctionBack `ShopPhoneStatusUpdate` — `PUT /shops/phone-status`. */
export interface ShopPhoneStatusUpdate {
  name: string;
  show_phone: boolean;
}

/** junctionBack `ShopLockStatusUpdate` — `PUT /shops/lock-status`. */
export interface ShopLockStatusUpdate {
  name: string;
  is_locked: boolean;
  lock_reason?: 'manual' | 'plan_expired' | null;
}

interface CityListResponse {
  cities: string[];
}

interface LocalityListResponse {
  city: string;
  localities: string[];
}

@Injectable({ providedIn: 'root' })
export class ShopsApi {
  private readonly api = inject(BackOfficeApiService);

  list(): Observable<Shop[]> {
    return this.api.get<Shop[]>('/shops');
  }

  /** Full shop-type catalog (`GET /shops/types`) for create/edit forms. */
  listTypes(): Observable<ShopTypeInfo[]> {
    return this.api.get<ShopTypeInfo[]>('/shops/types').pipe(catchError(() => of([])));
  }

  get(shopId: string): Observable<Shop> {
    return this.api.get<Shop>(`/shops/${shopId}`);
  }

  create(payload: Partial<ShopWrite> & Pick<ShopWrite, 'name'>): Observable<Shop> {
    return this.api.post<Shop>('/shops', payload);
  }

  update(shopId: string, payload: Partial<ShopWrite>): Observable<Shop> {
    return this.api.put<Shop>(`/shops/${shopId}`, payload);
  }

  remove(shopId: string): Observable<void> {
    return this.api.delete(`/shops/${shopId}`);
  }

  updateOpenStatus(payload: ShopOpenStatusUpdate): Observable<Shop> {
    return this.api.put<Shop>('/shops/open-status', payload);
  }

  /** Persist whether junction.today should show this shop's mobile number. */
  updatePhoneStatus(payload: ShopPhoneStatusUpdate): Observable<Shop> {
    return this.api.put<Shop>('/shops/phone-status', payload);
  }

  /** Persist owner vs viewer (partial lock) for a shop. */
  updateLockStatus(payload: ShopLockStatusUpdate): Observable<Shop> {
    return this.api.put<Shop>('/shops/lock-status', payload);
  }

  /** `GET /shops/{shop_id}/plan` — billing/limits are per shop. */
  plan(shopId: string): Observable<PlanSummary> {
    return this.api.get<PlanSummary>(`/shops/${shopId}/plan`, undefined, 'user');
  }

  /**
   * `POST /shops/{shop_id}/plan/purchase` — starts pending payment.
   * Plan activates after `POST /payments/{id}/complete`.
   * Admins may be activated immediately by the backend.
   */
  purchasePlan(shopId: string, planType: PlanType): Observable<ShopPayment> {
    return this.api.post<ShopPayment>(
      `/shops/${shopId}/plan/purchase`,
      { plan_type: planType },
      'user',
    );
  }

  /** Alias of purchase — kept for older clients. */
  selectPlan(shopId: string, planType: PlanType): Observable<ShopPayment> {
    return this.api.post<ShopPayment>(
      `/shops/${shopId}/plan/select`,
      { plan_type: planType },
      'user',
    );
  }
}

/** junctionBack `AddJunctionResponse` (`POST /locations/add-junction`). */
export interface AddJunctionResult {
  city: string;
  locality: string;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Location catalog — junctionBack requires a guest session JWT (`JunctionSession`),
 * not the owner access JWT. ApiService resolves auth mode `session` for /locations/*.
 */
@Injectable({ providedIn: 'root' })
export class LocationsApi {
  private readonly api = inject(BackOfficeApiService);

  cities(): Observable<string[]> {
    return this.api.get<CityListResponse | string[]>('/locations/cities', undefined, 'session').pipe(
      map((res) => (Array.isArray(res) ? res : (res?.cities ?? []))),
      catchError(() => of([])),
    );
  }

  localities(city: string): Observable<string[]> {
    const trimmed = city.trim();
    if (!trimmed) {
      return of([]);
    }
    return this.api
      .get<LocalityListResponse | string[]>('/locations/localities', { city: trimmed }, 'session')
      .pipe(
        map((res) => (Array.isArray(res) ? res : (res?.localities ?? []))),
        catchError(() => of([])),
      );
  }

  /** Geocode + upsert city/locality — session JWT required. */
  addJunction(city: string, locality: string): Observable<AddJunctionResult> {
    return this.api.post<AddJunctionResult>(
      '/locations/add-junction',
      { city: city.trim(), locality: locality.trim() },
      'session',
    );
  }
}

export function normalizeShopTime(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) {
    return null;
  }
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export const DEFAULT_OPEN_TIME = '09:00';
export const DEFAULT_CLOSED_TIME = '21:00';
