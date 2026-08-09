import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { Employee, EmployeeCreate, EmployeeUpdate } from './models';
import { DEFAULT_STORE_ID } from './store.config';

@Injectable({ providedIn: 'root' })
export class EmployeesApi {
  private readonly api = inject(BackOfficeApiService);

  list(filters?: { status?: string; department?: string }): Observable<Employee[]> {
    const params: Record<string, string> = { store_id: DEFAULT_STORE_ID };
    if (filters?.status) {
      params['status'] = filters.status;
    }
    if (filters?.department) {
      params['department'] = filters.department;
    }
    return this.api.get<Employee[]>('/employees', params);
  }

  create(payload: EmployeeCreate): Observable<Employee> {
    return this.api.post<Employee>('/employees', payload);
  }

  update(id: string, payload: EmployeeUpdate): Observable<Employee> {
    return this.api.put<Employee>(`/employees/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`/employees/${id}`);
  }
}
