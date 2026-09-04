import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';
import { CurrentShopService } from './current-shop.service';
import { EmployeesApi } from './employees.api';
import { Employee } from './models';

/**
 * In-memory employees store keyed by active shop.
 * Serve cache immediately; API refresh updates the store and the view.
 */
@Injectable({ providedIn: 'root' })
export class EmployeesStore {
  private readonly api = inject(EmployeesApi);
  private readonly currentShop = inject(CurrentShopService);

  private readonly byShop = new Map<string, BehaviorSubject<Employee[]>>();
  private readonly refreshing = new Set<string>();

  readonly employees = signal<Employee[]>([]);

  getSnapshot(shopId?: string | null): Employee[] {
    const id = (shopId ?? this.currentShop.storeId())?.trim();
    if (!id) {
      return [];
    }
    return this.subjectFor(id).value;
  }

  setEmployees(shopId: string, employees: Employee[]): void {
    const id = shopId.trim();
    this.subjectFor(id).next(employees);
    if (this.currentShop.storeId() === id) {
      this.employees.set(employees);
    }
  }

  upsert(employee: Employee): void {
    const shopId = (employee.store_id || this.currentShop.storeId() || '').trim();
    if (!shopId) {
      return;
    }
    const rows = this.subjectFor(shopId).value;
    const idx = rows.findIndex((row) => row.id === employee.id);
    const next =
      idx >= 0
        ? rows.map((row, i) => (i === idx ? employee : row))
        : [employee, ...rows];
    this.setEmployees(shopId, next);
  }

  removeLocal(employeeId: string, shopId?: string | null): void {
    const id = (shopId ?? this.currentShop.storeId())?.trim();
    if (!id) {
      return;
    }
    this.setEmployees(
      id,
      this.subjectFor(id).value.filter((row) => row.id !== employeeId),
    );
  }

  watch(forceRefresh = false, filters?: { status?: string }): Observable<Employee[]> {
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const shopId = shop?.id?.trim();
        if (!shopId) {
          this.employees.set([]);
          return of([] as Employee[]);
        }
        const subject = this.subjectFor(shopId);
        this.employees.set(subject.value);
        this.kickRefresh(shopId, forceRefresh, filters);
        return subject.asObservable().pipe(
          tap((rows) => {
            if (this.currentShop.storeId() === shopId) {
              this.employees.set(rows);
            }
          }),
        );
      }),
    );
  }

  refresh(filters?: { status?: string }): Observable<Employee[]> {
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const shopId = shop?.id?.trim();
        if (!shopId) {
          return of([] as Employee[]);
        }
        return this.fetchAndSet(shopId, filters);
      }),
    );
  }

  private kickRefresh(
    shopId: string,
    force: boolean,
    filters?: { status?: string },
  ): void {
    const key = `${shopId}|${filters?.status ?? ''}`;
    if (this.refreshing.has(key) && !force) {
      return;
    }
    this.refreshing.add(key);
    this.fetchAndSet(shopId, filters)
      .pipe(
        catchError(() => of([] as Employee[])),
        tap(() => this.refreshing.delete(key)),
      )
      .subscribe();
  }

  private fetchAndSet(
    shopId: string,
    filters?: { status?: string },
  ): Observable<Employee[]> {
    return this.api.list(filters).pipe(
      tap((rows) => this.setEmployees(shopId, rows)),
      catchError(() => of(this.getSnapshot(shopId))),
    );
  }

  private subjectFor(shopId: string): BehaviorSubject<Employee[]> {
    let subject = this.byShop.get(shopId);
    if (!subject) {
      subject = new BehaviorSubject<Employee[]>([]);
      this.byShop.set(shopId, subject);
    }
    return subject;
  }
}
