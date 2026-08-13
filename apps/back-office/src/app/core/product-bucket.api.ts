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

/** Identify a shop via store_id, shop_id alias, or product_id (junctionBack resolve_store_id). */
export interface ProductBucketShopRef {
  storeId?: string | null;
  shopId?: string | null;
  productId?: string | null;
}

export const DEFAULT_PACK_SIZE = 40;
export const DEFAULT_PACK_PRICE_INR = 999;

/**
 * Shop product capacity — plan limit + optional packs under owner JWT.
 * Packs are purchased via `POST /product-bucket/purchase` then payment complete.
 */
@Injectable({ providedIn: 'root' })
export class ProductBucketApi {
  private readonly api = inject(BackOfficeApiService);
  private readonly currentShop = inject(CurrentShopService);

  /**
   * `GET /product-bucket` — pass `store_id`, `shop_id`, or `product_id`.
   * When omitted, uses the active shop.
   */
  get(ref?: string | ProductBucketShopRef): Observable<ProductBucket | null> {
    return this.resolveShopRef(ref).pipe(
      switchMap((resolved) => {
        if (!resolved) {
          return of(null);
        }
        const params = this.queryParams(resolved);
        if (!params) {
          return of(null);
        }
        return this.api.get<ProductBucket>('/product-bucket', params, 'user');
      }),
    );
  }

  /**
   * `POST /product-bucket/purchase` — start pack purchase (pending payment).
   * Body accepts `store_id`, `shop_id`, or `product_id`.
   */
  purchasePacks(
    packs = 1,
    ref?: string | ProductBucketShopRef,
  ): Observable<ShopPayment | ProductBucket | null> {
    const qty = Math.floor(Number(packs));
    if (!Number.isFinite(qty) || qty < 1) {
      return of(null);
    }
    return this.resolveShopRef(ref).pipe(
      switchMap((resolved) => {
        const body = this.bodyShopRef(resolved, qty);
        if (!body) {
          return of(null);
        }
        return this.api.post<ShopPayment | ProductBucket>(
          '/product-bucket/purchase',
          body,
          'user',
        );
      }),
    );
  }

  /** Alias — `POST /product-bucket/slots`. Admins may get capacity immediately. */
  addPacks(
    packs = 1,
    ref?: string | ProductBucketShopRef,
  ): Observable<ShopPayment | ProductBucket | null> {
    const qty = Math.floor(Number(packs));
    if (!Number.isFinite(qty) || qty < 1) {
      return of(null);
    }
    return this.resolveShopRef(ref).pipe(
      switchMap((resolved) => {
        const body = this.bodyShopRef(resolved, qty);
        if (!body) {
          return of(null);
        }
        return this.api.post<ShopPayment | ProductBucket>(
          '/product-bucket/slots',
          body,
          'user',
        );
      }),
    );
  }

  private resolveShopRef(ref?: string | ProductBucketShopRef): Observable<ProductBucketShopRef | null> {
    if (typeof ref === 'string') {
      const id = ref.trim();
      return of(id ? { storeId: id } : null);
    }
    if (ref) {
      const storeId = ref.storeId?.trim();
      const shopId = ref.shopId?.trim();
      const productId = ref.productId?.trim();
      if (storeId || shopId || productId) {
        return of({ storeId, shopId, productId });
      }
    }
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const id = shop?.id?.trim();
        return of(id ? { storeId: id } : null);
      }),
    );
  }

  private queryParams(ref: ProductBucketShopRef): Record<string, string> | null {
    const productId = ref.productId?.trim();
    if (productId) {
      return { product_id: productId };
    }
    const shopId = ref.shopId?.trim();
    if (shopId) {
      return { shop_id: shopId };
    }
    const storeId = ref.storeId?.trim();
    if (storeId) {
      return { store_id: storeId };
    }
    return null;
  }

  private bodyShopRef(
    ref: ProductBucketShopRef | null,
    packs: number,
  ): Record<string, string | number> | null {
    if (!ref) {
      return null;
    }
    const productId = ref.productId?.trim();
    if (productId) {
      return { product_id: productId, packs };
    }
    const shopId = ref.shopId?.trim();
    if (shopId) {
      return { shop_id: shopId, packs };
    }
    const storeId = ref.storeId?.trim();
    if (storeId) {
      return { store_id: storeId, packs };
    }
    return null;
  }
}
