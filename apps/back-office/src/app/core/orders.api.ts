import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { Order, OrderCreate, OrderStatus } from './models';
import { DEFAULT_STORE_ID } from './store.config';

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly api = inject(BackOfficeApiService);

  list(filters?: { customer_name?: string; status?: OrderStatus }): Observable<Order[]> {
    const params: Record<string, string> = { store_id: DEFAULT_STORE_ID };
    if (filters?.customer_name?.trim()) {
      params['customer_name'] = filters.customer_name.trim();
    }
    if (filters?.status) {
      params['status'] = filters.status;
    }
    return this.api.get<Order[]>('/orders', params);
  }

  create(payload: OrderCreate): Observable<Order> {
    return this.api.post<Order>('/orders', payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`/orders/${id}`);
  }
}
