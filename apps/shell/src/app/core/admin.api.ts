import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlanSummary, PlanType } from './auth.models';

export interface AdminUser {
  id: string;
  display_name: string;
  phone_number?: string | null;
  email?: string | null;
  is_admin: boolean;
  /** When present: admin | owner | viewer */
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  plan: PlanSummary;
}

/** Shop row for the admin console (owner account + product count). */
export interface AdminShop {
  id: string;
  name: string;
  store_id: string;
  owner_id: string;
  owner_name: string;
  phone_number?: string | null;
  email?: string | null;
  products_count: number;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminShopStatusRequest {
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly api = inject(ApiService);

  listShops(query = ''): Observable<AdminShop[]> {
    const params = query.trim() ? { q: query.trim() } : undefined;
    return this.api.get<AdminShop[]>('/admin/shops', params);
  }

  getShop(shopId: string): Observable<AdminShop> {
    return this.api.get<AdminShop>(`/admin/shops/${shopId}`);
  }

  setShopActive(shopId: string, isActive: boolean): Observable<AdminShop> {
    return this.api.post<AdminShop>(`/admin/shops/${shopId}/status`, {
      is_active: isActive,
    } satisfies AdminShopStatusRequest);
  }

  activateShop(shopId: string): Observable<AdminShop> {
    return this.api.post<AdminShop>(`/admin/shops/${shopId}/activate`, {});
  }

  deactivateShop(shopId: string): Observable<AdminShop> {
    return this.api.post<AdminShop>(`/admin/shops/${shopId}/deactivate`, {});
  }

  listUsers(query = ''): Observable<AdminUser[]> {
    const params = query.trim() ? { q: query.trim() } : undefined;
    return this.api.get<AdminUser[]>('/admin/users', params);
  }

  getUser(userId: string): Observable<AdminUser> {
    return this.api.get<AdminUser>(`/admin/users/${userId}`);
  }

  setPlan(userId: string, planType: PlanType): Observable<AdminUser> {
    return this.api.post<AdminUser>(`/admin/users/${userId}/plan`, { plan_type: planType });
  }

  activate(userId: string, planType: PlanType): Observable<AdminUser> {
    return this.api.post<AdminUser>(`/admin/users/${userId}/activate`, { plan_type: planType });
  }
}
