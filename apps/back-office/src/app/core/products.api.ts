import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { CurrentShopService } from './current-shop.service';
import { Product, ProductCreate, ProductImageSuggestResponse, ProductUpdate } from './models';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly api = inject(BackOfficeApiService);
  private readonly currentShop = inject(CurrentShopService);

  list(): Observable<Product[]> {
    return this.withStoreId((storeId) =>
      this.api.get<Product[]>('/products', { store_id: storeId }),
    );
  }

  create(payload: Omit<ProductCreate, 'store_id'> & { store_id?: string }): Observable<Product> {
    return this.withStoreId((storeId) =>
      this.api.post<Product>('/products', { ...payload, store_id: payload.store_id || storeId }),
    );
  }

  update(id: string, payload: ProductUpdate): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`/products/${id}`);
  }

  /** Product Pexels suggestions — POST /products/images/suggest { product_name } */
  suggestImages(productName: string): Observable<ProductImageSuggestResponse> {
    return this.api.post<ProductImageSuggestResponse>('/products/images/suggest', {
      product_name: productName.trim(),
    });
  }

  /** Attach up to 5 CDN images (replaces gallery) — POST /products/:id/images */
  attachImagesFromCdn(productId: string, cdns: string[]): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/images`, { cdns });
  }

  /** Upload a local image blob — POST /products/:id/image/upload (multipart) */
  uploadImage(productId: string, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.postFormData<Product>(`/products/${productId}/image/upload`, formData);
  }

  /** @deprecated Prefer attachImagesFromCdn */
  useImageFromCdn(productId: string, cdn: string): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/image/use`, { cdn });
  }

  setImageCdn(productId: string, cdn: string): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/image/cdn`, { cdn });
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
