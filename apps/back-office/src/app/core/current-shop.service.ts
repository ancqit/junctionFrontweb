import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Shop, ShopsApi } from './shops.api';

const SHOP_TYPE_STORAGE_KEY = 'junction.shopTypeById';

/**
 * Resolves the logged-in owner's primary shop and its `store_id`
 * (junctionBack: products/orders/employees use shop `id` as `store_id`).
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
        map((shops) => shops[0] ?? null),
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
    this.shop.set(shop);
    this.storeId.set(shop?.id ?? null);
    this.load$ = of(shop).pipe(shareReplay(1));
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
}
