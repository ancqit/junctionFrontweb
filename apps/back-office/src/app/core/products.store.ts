import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';
import { CurrentShopService } from './current-shop.service';
import { Product } from './models';
import { ProductsApi } from './products.api';

/**
 * In-memory products store keyed by active shop.
 * Serve cache immediately; API refresh updates the store and the view.
 */
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly api = inject(ProductsApi);
  private readonly currentShop = inject(CurrentShopService);

  private readonly byShop = new Map<string, BehaviorSubject<Product[]>>();
  private readonly refreshing = new Set<string>();

  readonly products = signal<Product[]>([]);

  getSnapshot(shopId?: string | null): Product[] {
    const id = (shopId ?? this.currentShop.storeId())?.trim();
    if (!id) {
      return [];
    }
    return this.subjectFor(id).value;
  }

  setProducts(shopId: string, products: Product[]): void {
    const id = shopId.trim();
    this.subjectFor(id).next(products);
    if (this.currentShop.storeId() === id) {
      this.products.set(products);
    }
  }

  upsert(product: Product): void {
    const shopId = (product.store_id || this.currentShop.storeId() || '').trim();
    if (!shopId) {
      return;
    }
    const rows = this.subjectFor(shopId).value;
    const idx = rows.findIndex((row) => row.id === product.id);
    const next =
      idx >= 0 ? rows.map((row, i) => (i === idx ? product : row)) : [product, ...rows];
    this.setProducts(shopId, next);
  }

  removeLocal(productId: string, shopId?: string | null): void {
    const id = (shopId ?? this.currentShop.storeId())?.trim();
    if (!id) {
      return;
    }
    this.setProducts(
      id,
      this.subjectFor(id).value.filter((row) => row.id !== productId),
    );
  }

  /**
   * Watch products for the active shop.
   * Emits cached rows first (may be []), then API updates.
   */
  watch(forceRefresh = false): Observable<Product[]> {
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const shopId = shop?.id?.trim();
        if (!shopId) {
          this.products.set([]);
          return of([] as Product[]);
        }
        const subject = this.subjectFor(shopId);
        this.products.set(subject.value);
        this.kickRefresh(shopId, forceRefresh);
        return subject.asObservable().pipe(
          tap((rows) => {
            if (this.currentShop.storeId() === shopId) {
              this.products.set(rows);
            }
          }),
        );
      }),
    );
  }

  /** Force API refresh and update store (after create/update/delete). */
  refresh(): Observable<Product[]> {
    return this.currentShop.ensureShop().pipe(
      switchMap((shop) => {
        const shopId = shop?.id?.trim();
        if (!shopId) {
          return of([] as Product[]);
        }
        return this.fetchAndSet(shopId);
      }),
    );
  }

  private kickRefresh(shopId: string, force: boolean): void {
    if (this.refreshing.has(shopId) && !force) {
      return;
    }
    this.refreshing.add(shopId);
    this.fetchAndSet(shopId)
      .pipe(
        catchError(() => of([] as Product[])),
        tap(() => this.refreshing.delete(shopId)),
      )
      .subscribe();
  }

  private fetchAndSet(shopId: string): Observable<Product[]> {
    return this.api.list().pipe(
      tap((rows) => this.setProducts(shopId, rows)),
      catchError(() => of(this.getSnapshot(shopId))),
    );
  }

  private subjectFor(shopId: string): BehaviorSubject<Product[]> {
    let subject = this.byShop.get(shopId);
    if (!subject) {
      subject = new BehaviorSubject<Product[]>([]);
      this.byShop.set(shopId, subject);
    }
    return subject;
  }
}
