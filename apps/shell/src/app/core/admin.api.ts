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

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly api = inject(ApiService);

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
