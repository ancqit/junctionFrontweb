import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';

/** junctionBack `SessionShopContact` (`GET /session/shops*`). */
export interface SessionShopContact {
  id: string;
  name: string;
  phone_number: string | null;
  show_phone: boolean;
}

export interface SessionShopsQuery {
  showPhone: boolean;
  shopId?: string;
  storeId?: string;
  city?: string;
  locality?: string;
}

/**
 * junction.today session shop contacts — `show_phone` query toggles catalog mobile visibility.
 * Aligns with junctionBack `GET /session/shops?shop_id=&show_phone=` and `/session/shops/{id}`.
 */
@Injectable({ providedIn: 'root' })
export class SessionShopsApi {
  private readonly api = inject(BackOfficeApiService);

  /** Toggle one shop: `GET /session/shops?shop_id=<id>&show_phone=true|false`. */
  getShop(shopId: string, showPhone: boolean): Observable<SessionShopContact> {
    return this.list({ showPhone, shopId }).pipe(
      map((rows) => {
        const match = rows.find((row) => row.id === shopId.trim());
        if (match) {
          return match;
        }
        if (rows.length === 1) {
          return rows[0];
        }
        throw new Error('Shop not found');
      }),
    );
  }

  list(query: SessionShopsQuery): Observable<SessionShopContact[]> {
    const params: Record<string, string> = {
      show_phone: showPhoneParam(query.showPhone),
    };
    const shopId = query.shopId?.trim();
    const storeId = query.storeId?.trim();
    if (shopId) {
      params['shop_id'] = shopId;
    } else if (storeId) {
      params['store_id'] = storeId;
    }
    const city = query.city?.trim();
    const locality = query.locality?.trim();
    if (city && locality) {
      params['city'] = city;
      params['locality'] = locality;
    }
    return this.api.get<SessionShopContact[]>('/session/shops', params, 'session');
  }
}

function showPhoneParam(showPhone: boolean): string {
  return showPhone ? 'true' : 'false';
}
