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

export interface ShopCreate {
  name: string;
  city: string;
  locality: string;
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

/** Admin console row: shop + owner account + product count. */
export interface AdminShopRow {
  id: string;
  name: string;
  phone_number: string;
  owner_user_id: string;
  owner_name: string;
  owner_role: string;
  account_status: string;
  plan_name: string;
  plan_is_active: boolean;
  products_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductStoreRef {
  store_id?: string;
  id?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly api = inject(ApiService);

  /** Admin sees all shops (`GET /shops`). */
  listShops(): Observable<Shop[]> {
    return this.api.get<Shop[]>('/shops');
  }

  /**
   * Create a shop — junctionBack `POST /shops`
   * Body: `{ name, city, locality }` (phone taken from the logged-in admin).
   */
  createShop(payload: ShopCreate): Observable<Shop> {
    return this.api.post<Shop>('/shops', {
      name: payload.name.trim(),
      city: payload.city.trim(),
      locality: payload.locality.trim(),
    });
  }

  listUsers(): Observable<AdminUserRecord[]> {
    return this.api.get<AdminUserRecord[]>('/admin/users');
  }

  /** Activate owner account — `POST /admin/users/{id}/activate` (no body). */
  activateUser(userId: string): Observable<AdminUserRecord> {
    return this.api.post<AdminUserRecord>(`/admin/users/${userId}/activate`);
  }

  /** Deactivate owner account — `POST /admin/users/{id}/deactivate` (admin only). */
  deactivateUser(userId: string): Observable<AdminUserRecord> {
    return this.api.post<AdminUserRecord>(`/admin/users/${userId}/deactivate`);
  }

  updateUserRole(userId: string, role: UserRole): Observable<AdminUserRecord> {
    return this.api.patch<AdminUserRecord>(`/admin/users/${userId}/role`, { role });
  }

  /**
   * Shops for the admin table, joined with owner account status and product counts.
   * Product counts use `store_id === shop.id` (junctionBack products collection).
   */
  listShopRows(): Observable<AdminShopRow[]> {
    return forkJoin({
      shops: this.listShops(),
      users: this.listUsers().pipe(catchError(() => of([] as AdminUserRecord[]))),
      products: this.api.get<ProductStoreRef[]>('/products').pipe(catchError(() => of([] as ProductStoreRef[]))),
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
          const accountStatus = owner?.account_status ?? 'active';
          return {
            id: shop.id,
            name: shop.name,
            phone_number: shop.phone_number,
            owner_user_id: shop.owner_user_id,
            owner_name: owner?.display_name ?? 'Owner',
            owner_role: String(owner?.role ?? 'owner'),
            account_status: accountStatus,
            plan_name: owner?.plan_name ?? '—',
            plan_is_active: owner?.plan_is_active ?? accountStatus === 'active',
            products_count: counts.get(shop.id) ?? 0,
            is_active: accountStatus === 'active',
            created_at: shop.created_at,
            updated_at: shop.updated_at,
          } satisfies AdminShopRow;
        });
      }),
    );
  }
}
