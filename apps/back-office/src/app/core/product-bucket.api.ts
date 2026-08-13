import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { CurrentShopService } from './current-shop.service';
import { PlanType } from './models';

/** junctionBack `ProductBucketResponse` (`GET /product-bucket`). JWT only. */
export interface ProductBucket {
  store_id: string;
  plan_type: PlanType | string;
  plan_name: string;
  /** Plan included allowance (null = unlimited, e.g. Premium). */
  plan_limit: number | null;
  products_count: number;
  /** Extra capacity beyond the plan limit. */
  extra_slots: number;
  /** plan_limit + extra_slots (null = unlimited). */
  capacity: number | null;
  remaining: number | null;
  can_add_product: boolean;
  /** True once products_count >= plan_limit. */
  plan_allowance_consumed: boolean;
}

/**
 * Shop product bucket — plan-aligned capacity under owner JWT
 * (not the junction.today guest session).
 *
 * Starter 10 / Growth 100 / Premium unlimited (plus free trial 150).
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
   * `POST /product-bucket/slots` — add extra capacity after plan allowance is used.
   * Only available when products_count >= plan_limit (not for unlimited Premium).
   */
  addSlots(quantity: number, storeId?: string): Observable<ProductBucket | null> {
    const qty = Math.floor(Number(quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      return of(null);
    }
    return this.withStoreId(storeId, (id) =>
      this.api.post<ProductBucket>('/product-bucket/slots', { store_id: id, quantity: qty }, 'user'),
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
