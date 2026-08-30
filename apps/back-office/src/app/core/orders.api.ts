import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { CurrentShopService } from './current-shop.service';
import { Order, OrderCreate, OrderStatus } from './models';

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly api = inject(BackOfficeApiService);
  private readonly currentShop = inject(CurrentShopService);

  list(filters?: { customer_name?: string; status?: OrderStatus }): Observable<Order[]> {
    return this.withStoreId((storeId) => {
      const params: Record<string, string> = { store_id: storeId };
      if (filters?.customer_name?.trim()) {
        params['customer_name'] = filters.customer_name.trim();
      }
      if (filters?.status) {
        params['status'] = filters.status;
      }
      return this.api.get<Order[]>('/orders', params);
    });
  }

  create(payload: Omit<OrderCreate, 'store_id'> & { store_id?: string }): Observable<Order> {
    return this.withStoreId((storeId) =>
      this.api.post<Order>('/orders', { ...payload, store_id: payload.store_id || storeId }),
    );
  }

  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.api.patch<Order>(`/orders/${id}`, { status });
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`/orders/${id}`);
  }

  private withStoreId<T>(fn: (storeId: string) => Observable<T>): Observable<T> {
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const storeId = shop?.id?.trim();
        if (!storeId) {
          return of([] as unknown as T);
        }
        return fn(storeId);
      }),
    );
  }
}
