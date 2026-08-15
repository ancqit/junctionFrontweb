import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { CurrentShopService } from './current-shop.service';
import { PlanType } from './models';
import { ShopPayment } from './payments.api';

/** junctionBack `ProductBucketResponse` (`GET /product-bucket`). JWT only. */
export interface ProductBucket {
  store_id: string;
  plan_type: PlanType | string;
  plan_name: string;
  /** Plan included allowance. */
  plan_limit: number | null;
  products_count: number;
  /** Extra capacity from purchased packs (slots, not packs). */
  extra_slots: number;
  /** plan_limit + extra_slots. */
  capacity: number | null;
  remaining: number | null;
  can_add_product: boolean;
  /** True once products_count >= plan_limit. */
  plan_allowance_consumed: boolean;
  pack_size?: number;
  pack_price_inr?: number;
}

export const DEFAULT_PACK_SIZE = 40;
export const DEFAULT_PACK_PRICE_INR = 999;

/**
 * Shop product capacity — plan limit + optional packs under owner JWT.
 * Packs are purchased via `POST /product-bucket/purchase` then Razorpay verify.
 */
@Injectable({ providedIn: 'root' })
export class ProductBucketApi {
  private readonly api = inject(BackOfficeApiService);
  private readonly currentShop = inject(CurrentShopService);

  /** `GET /product-bucket?store_id=` — product count vs plan capacity. */
  get(storeId?: string): Observable<ProductBucket | null> {
    return this.withStoreId(storeId, (id) =>
      this.api.get<ProductBucket>('/product-bucket', { store_id: id }, 'user'),
    );
  }

  /**
   * `POST /product-bucket/purchase` — start pack purchase (pending payment).
   * Admins may get immediate capacity via `/slots` alias.
   */
  purchasePacks(packs = 1, storeId?: string): Observable<ShopPayment | ProductBucket | null> {
    const qty = Math.floor(Number(packs));
    if (!Number.isFinite(qty) || qty < 1) {
      return of(null);
    }
    return this.withStoreId(storeId, (id) =>
      this.api.post<ShopPayment | ProductBucket>(
        '/product-bucket/purchase',
        { store_id: id, packs: qty },
        'user',
      ),
    );
  }

  /**
   * Alias — `POST /product-bucket/slots` with `{ store_id, packs }`.
   * Prefer purchasePacks + payments complete for non-admins.
   */
  addPacks(packs = 1, storeId?: string): Observable<ShopPayment | ProductBucket | null> {
    const qty = Math.floor(Number(packs));
    if (!Number.isFinite(qty) || qty < 1) {
      return of(null);
    }
    return this.withStoreId(storeId, (id) =>
      this.api.post<ShopPayment | ProductBucket>(
        '/product-bucket/slots',
        { store_id: id, packs: qty },
        'user',
      ),
    );
  }

  private withStoreId<T>(
    storeId: string | undefined,
    fn: (id: string) => Observable<T>,
  ): Observable<T | null> {
    if (storeId?.trim()) {
      return fn(storeId.trim());
    }
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const id = shop?.id?.trim();
        if (!id) {
          return of(null);
        }
        return fn(id);
      }),
    );
  }
}
