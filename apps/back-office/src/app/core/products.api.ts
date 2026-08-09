import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { Product, ProductCreate, ProductUpdate } from './models';
import { DEFAULT_STORE_ID } from './store.config';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly api = inject(BackOfficeApiService);

  list(): Observable<Product[]> {
    return this.api.get<Product[]>('/products', { store_id: DEFAULT_STORE_ID });
  }

  create(payload: ProductCreate): Observable<Product> {
    return this.api.post<Product>('/products', payload);
  }

  update(id: string, payload: ProductUpdate): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`/products/${id}`);
  }

  /** Persist a CDN image from /queries onto an existing product. */
  useImageFromCdn(productId: string, cdn: string): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/image/use`, { cdn });
  }

  setImageCdn(productId: string, cdn: string): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/image/cdn`, { cdn });
  }
}
