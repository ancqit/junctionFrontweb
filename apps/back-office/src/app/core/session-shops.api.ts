import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';

/** junctionBack `SessionShopContact` (`GET /session/shops/{id}`). */
export interface SessionShopContact {
  id: string;
  name: string;
  phone_number: string | null;
  show_phone: boolean;
}

/**
 * junction.today session shop contacts — `show_phone` query toggles mobile visibility.
 * See junctionBack PR #37 / `GET /session/shops*`.
 */
@Injectable({ providedIn: 'root' })
export class SessionShopsApi {
  private readonly api = inject(BackOfficeApiService);

  getShop(shopId: string, showPhone: boolean): Observable<SessionShopContact> {
    return this.api.get<SessionShopContact>(
      `/session/shops/${shopId}`,
      { show_phone: showPhone ? 'true' : 'false' },
      'session',
    );
  }
}
