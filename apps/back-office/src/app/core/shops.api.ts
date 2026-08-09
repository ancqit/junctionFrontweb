import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';

export interface Shop {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  city: string;
  locality: string;
  created_at: string;
  updated_at: string;
}

/** Matches junctionBack ShopCreate — name, city, and locality are required. */
export interface ShopWrite {
  name: string;
  city: string;
  locality: string;
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

  create(payload: ShopWrite): Observable<Shop> {
    return this.api.post<Shop>('/shops', payload);
  }

  update(shopId: string, payload: Partial<ShopWrite>): Observable<Shop> {
    return this.api.put<Shop>(`/shops/${shopId}`, payload);
  }
}

@Injectable({ providedIn: 'root' })
export class LocationsApi {
  private readonly api = inject(BackOfficeApiService);

  cities(): Observable<string[]> {
    return this.api.get<CityListResponse | string[]>('/locations/cities').pipe(
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
      .get<LocalityListResponse | string[]>('/locations/localities', { city: trimmed })
      .pipe(
        map((res) => (Array.isArray(res) ? res : (res?.localities ?? []))),
        catchError(() => of([])),
      );
  }
}
