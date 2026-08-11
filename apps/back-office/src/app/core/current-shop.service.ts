import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Shop, ShopsApi } from './shops.api';

const SHOP_TYPE_STORAGE_KEY = 'junction.shopTypeById';
const SHOP_PLACE_STORAGE_KEY = 'junction.shopPlaceById';
const SHOP_HOURS_STORAGE_KEY = 'junction.shopHoursById';

export interface ShopPlaceOverlay {
  city: string;
  locality: string;
}

/** Client overlay until junctionBack exposes shop hours on `Shop`. */
export interface ShopHoursOverlay {
  opening_time: string;
  closing_time: string;
  is_open: boolean;
}

const DEFAULT_OPENING_TIME = '09:00';
const DEFAULT_CLOSING_TIME = '21:00';

/**
 * Resolves the logged-in owner's primary shop and its `store_id`
 * (junctionBack: products/orders/employees use shop `id` as `store_id`).
 *
 * Shop type (and place, when the live API omits city/locality) are kept in
 * localStorage so Overview can unlock after save even on older Render builds.
 */
@Injectable({ providedIn: 'root' })
export class CurrentShopService {
  private readonly shopsApi = inject(ShopsApi);
  private load$?: Observable<Shop | null>;

  readonly shop = signal<Shop | null>(null);
  readonly storeId = signal<string | null>(null);

  /** Load (or reuse) the current shop. */
  ensureShop(): Observable<Shop | null> {
    if (!this.load$) {
      this.load$ = this.shopsApi.list().pipe(
        map((shops) => this.applyPlaceOverlay(shops[0] ?? null)),
        tap((shop) => {
          this.shop.set(shop);
          this.storeId.set(shop?.id ?? null);
        }),
        catchError(() => {
          this.shop.set(null);
          this.storeId.set(null);
          return of(null);
        }),
        shareReplay(1),
      );
    }
    return this.load$;
  }

  /** Force refresh after create/update. */
  refresh(): Observable<Shop | null> {
    this.load$ = undefined;
    return this.ensureShop();
  }

  setShop(shop: Shop | null): void {
    const merged = this.applyPlaceOverlay(shop);
    this.shop.set(merged);
    this.storeId.set(merged?.id ?? null);
    this.load$ = of(merged).pipe(shareReplay(1));
  }

  /** Fill missing city/locality from the client overlay written on Overview save. */
  applyPlaceOverlay(shop: Shop | null): Shop | null {
    if (!shop?.id) {
      return shop;
    }
    const place = this.readShopPlace(shop.id);
    if (!place) {
      return shop;
    }
    return {
      ...shop,
      city: shop.city?.trim() || place.city,
      locality: shop.locality?.trim() || place.locality,
    };
  }

  readShopType(shopId: string | null | undefined): string | null {
    if (!shopId) {
      return null;
    }
    try {
      const raw = localStorage.getItem(SHOP_TYPE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const map = JSON.parse(raw) as Record<string, string>;
      return map[shopId]?.trim() || null;
    } catch {
      return null;
    }
  }

  writeShopType(shopId: string, shopType: string): void {
    try {
      const raw = localStorage.getItem(SHOP_TYPE_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      map[shopId] = shopType.trim();
      localStorage.setItem(SHOP_TYPE_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  readShopPlace(shopId: string | null | undefined): ShopPlaceOverlay | null {
    if (!shopId) {
      return null;
    }
    try {
      const raw = localStorage.getItem(SHOP_PLACE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const map = JSON.parse(raw) as Record<string, ShopPlaceOverlay>;
      const row = map[shopId];
      const city = row?.city?.trim() ?? '';
      const locality = row?.locality?.trim() ?? '';
      if (!city || !locality) {
        return null;
      }
      return { city, locality };
    } catch {
      return null;
    }
  }

  writeShopPlace(shopId: string, place: ShopPlaceOverlay): void {
    try {
      const raw = localStorage.getItem(SHOP_PLACE_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, ShopPlaceOverlay>) : {};
      map[shopId] = {
        city: place.city.trim(),
        locality: place.locality.trim(),
      };
      localStorage.setItem(SHOP_PLACE_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  readShopHours(shopId: string | null | undefined): ShopHoursOverlay {
    if (!shopId) {
      return this.defaultShopHours();
    }
    try {
      const raw = localStorage.getItem(SHOP_HOURS_STORAGE_KEY);
      if (!raw) {
        return this.defaultShopHours();
      }
      const map = JSON.parse(raw) as Record<string, ShopHoursOverlay>;
      const row = map[shopId];
      if (!row) {
        return this.defaultShopHours();
      }
      return {
        opening_time: this.normalizeTime(row.opening_time) ?? DEFAULT_OPENING_TIME,
        closing_time: this.normalizeTime(row.closing_time) ?? DEFAULT_CLOSING_TIME,
        is_open: row.is_open === true,
      };
    } catch {
      return this.defaultShopHours();
    }
  }

  writeShopHours(shopId: string, hours: ShopHoursOverlay): void {
    try {
      const raw = localStorage.getItem(SHOP_HOURS_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, ShopHoursOverlay>) : {};
      map[shopId] = {
        opening_time: this.normalizeTime(hours.opening_time) ?? DEFAULT_OPENING_TIME,
        closing_time: this.normalizeTime(hours.closing_time) ?? DEFAULT_CLOSING_TIME,
        is_open: hours.is_open === true,
      };
      localStorage.setItem(SHOP_HOURS_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  private defaultShopHours(): ShopHoursOverlay {
    return {
      opening_time: DEFAULT_OPENING_TIME,
      closing_time: DEFAULT_CLOSING_TIME,
      is_open: false,
    };
  }

  private normalizeTime(value: string | null | undefined): string | null {
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
}
