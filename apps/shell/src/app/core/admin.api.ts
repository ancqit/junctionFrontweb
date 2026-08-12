import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PlanStatus, PlanType, UserRole } from './auth.models';

/** junctionBack `Shop` (`GET /shops`). */
export interface Shop {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  city?: string;
  locality?: string;
  created_at: string;
  updated_at: string;
}

/** junctionBack `AdminUserRecord` (`GET /admin/users`). */
export interface AdminUserRecord {
  id: string;
  display_name: string;
  email?: string | null;
  phone_number?: string | null;
  role: UserRole | string;
  account_status: string;
  plan_type: PlanType | string;
  plan_status: PlanStatus | string;
  plan_is_active: boolean;
  plan_name: string;
  selected_plan_type?: PlanType | string | null;
  in_grace_period?: boolean;
  days_remaining?: number | null;
  created_at: string;
  updated_at: string;
}

/** junctionBack `PlanApplication` (`GET /admin/waitlist`). */
export type WaitlistStatus = 'pending' | 'approved' | 'rejected';

export interface WaitlistApplication {
  id: string;
  user_id: string;
  shop_id: string;
  shop_name: string;
  identity: {
    display_name: string;
    phone_number?: string | null;
    email?: string | null;
  };
  location: {
    city: string;
    locality: string;
  };
  requested_plan_type: PlanType | string;
  current_plan_type: PlanType | string;
  is_plan_switch: boolean;
  switch_message: string;
  status: WaitlistStatus | string;
  created_at: string;
  updated_at: string;
}

/** Admin console row: shop + owner + product count. */
export interface AdminShopRow {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  owner_name: string;
  owner_role: string;
  city: string;
  locality: string;
  plan_name: string;
  products_count: number;
  created_at: string;
  updated_at: string;
}

interface ProductStoreRef {
  store_id?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly api = inject(ApiService);

  /** Admin sees all shops (`GET /shops`). */
  listShops(): Observable<Shop[]> {
    return this.api.get<Shop[]>('/shops');
  }

  listUsers(): Observable<AdminUserRecord[]> {
    return this.api.get<AdminUserRecord[]>('/admin/users');
  }

  /**
   * Viewer waitlist applications — `GET /admin/waitlist`
   * (alias of `/admin/plan-applications`).
   */
  listWaitlist(): Observable<WaitlistApplication[]> {
    return this.api.get<WaitlistApplication[]>('/admin/waitlist');
  }

  /**
   * Approve a viewer's pending waitlist entry —
   * `POST /admin/users/{id}/activate` (junctionBack #21).
   * Upgrades viewer → owner with their requested plan.
   */
  approveWaitlistUser(userId: string): Observable<AdminUserRecord> {
    return this.api.post<AdminUserRecord>(`/admin/users/${userId}/activate`);
  }

  /**
   * Shops for the admin table, joined with owner info and product counts.
   * Product counts use `store_id === shop.id`.
   */
  listShopRows(): Observable<AdminShopRow[]> {
    return forkJoin({
      shops: this.listShops().pipe(catchError(() => of([] as Shop[]))),
      users: this.listUsers().pipe(catchError(() => of([] as AdminUserRecord[]))),
      products: this.api
        .get<ProductStoreRef[]>('/products')
        .pipe(catchError(() => of([] as ProductStoreRef[]))),
    }).pipe(
      map(({ shops, users, products }) => {
        const usersById = new Map(users.map((user) => [user.id, user]));
        const counts = new Map<string, number>();
        for (const product of products) {
          const storeId = product.store_id;
          if (!storeId) {
            continue;
          }
          counts.set(storeId, (counts.get(storeId) ?? 0) + 1);
        }

        return shops.map((shop) => {
          const owner = usersById.get(shop.owner_user_id);
          return {
            id: shop.id,
            name: shop.name,
            phone_number: shop.phone_number,
            owner_user_id: shop.owner_user_id,
            owner_name: owner?.display_name ?? 'Owner',
            owner_role: String(owner?.role ?? 'owner'),
            city: shop.city?.trim() || '—',
            locality: shop.locality?.trim() || '—',
            plan_name: owner?.plan_name ?? '—',
            products_count: counts.get(shop.id) ?? 0,
            created_at: shop.created_at,
            updated_at: shop.updated_at,
          } satisfies AdminShopRow;
        });
      }),
    );
  }
}
