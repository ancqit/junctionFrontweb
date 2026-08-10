import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { CurrentShopService } from './current-shop.service';
import { Employee, EmployeeCreate, EmployeeUpdate } from './models';

@Injectable({ providedIn: 'root' })
export class EmployeesApi {
  private readonly api = inject(BackOfficeApiService);
  private readonly currentShop = inject(CurrentShopService);

  list(filters?: { status?: string; department?: string }): Observable<Employee[]> {
    return this.withStoreId((storeId) => {
      const params: Record<string, string> = { store_id: storeId };
      if (filters?.status) {
        params['status'] = filters.status;
      }
      if (filters?.department) {
        params['department'] = filters.department;
      }
      return this.api.get<Employee[]>('/employees', params);
    });
  }

  create(payload: Omit<EmployeeCreate, 'store_id'> & { store_id?: string }): Observable<Employee> {
    return this.withStoreId((storeId) =>
      this.api.post<Employee>('/employees', { ...payload, store_id: payload.store_id || storeId }),
    );
  }

  update(id: string, payload: EmployeeUpdate): Observable<Employee> {
    return this.api.put<Employee>(`/employees/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`/employees/${id}`);
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
