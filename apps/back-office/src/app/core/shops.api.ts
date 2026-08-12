import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';

/** junctionBack `Shop` (`GET /shops`). */
export interface Shop {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  city: string;
  locality: string;
  open_time?: string | null;
  closed_time?: string | null;
  is_open?: boolean;
  created_at: string;
  updated_at: string;
}

/** junctionBack `ShopCreate` / `ShopUpdate` fields used by back office. */
export interface ShopWrite {
  name: string;
  city: string;
  locality: string;
  open_time?: string;
  closed_time?: string;
  is_open?: boolean;
}

/** junctionBack `ShopOpenStatusUpdate` — `PUT /shops/open-status`. */
export interface ShopOpenStatusUpdate {
  name: string;
  is_open: boolean;
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
    return this.api.get<Shop[]>('/shops').pipe(catchError(() => of([])));
  }

  create(payload: Partial<ShopWrite> & Pick<ShopWrite, 'name'>): Observable<Shop> {
    return this.api.post<Shop>('/shops', payload);
  }

  update(shopId: string, payload: Partial<ShopWrite>): Observable<Shop> {
    return this.api.put<Shop>(`/shops/${shopId}`, payload);
  }

  updateOpenStatus(payload: ShopOpenStatusUpdate): Observable<Shop> {
    return this.api.put<Shop>('/shops/open-status', payload);
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
