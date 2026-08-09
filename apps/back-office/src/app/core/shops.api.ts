import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';

export interface Shop {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  city?: string | null;
  locality?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShopWrite {
  name: string;
  city?: string | null;
  locality?: string | null;
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

  update(shopId: string, payload: ShopWrite): Observable<Shop> {
    return this.api.put<Shop>(`/shops/${shopId}`, payload);
  }
}

@Injectable({ providedIn: 'root' })
export class LocationsApi {
  private readonly api = inject(BackOfficeApiService);

  cities(): Observable<string[]> {
    return this.api.get<string[]>('/locations/cities').pipe(
      catchError(() => of([])),
    );
  }

  localities(city: string): Observable<string[]> {
    const trimmed = city.trim();
    if (!trimmed) {
      return of([]);
    }
    return this.api.get<string[]>('/locations/localities', { city: trimmed }).pipe(
      catchError(() => of([])),
    );
  }
}
