import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { CurrentShopService } from './current-shop.service';
import { Product, ProductCreate, ProductImageSuggestResponse, ProductUpdate } from './models';

/** junctionBack `ProductCategoryInfo` (`GET /products/categories`). */
export interface ProductCategoryInfo {
  value: string;
  label: string;
  group?: string | null;
  description: string;
}

/** Fallback when categories API is unavailable. */
export const PRODUCT_CATEGORY_FALLBACK: ProductCategoryInfo[] = [
  { value: 'grocery', label: 'Grocery', description: 'Staples and packaged foods', group: 'food' },
  { value: 'dairy', label: 'Dairy', description: 'Milk and dairy', group: 'food' },
  { value: 'snacks', label: 'Snacks', description: 'Snacks and namkeen', group: 'food' },
  { value: 'beverages', label: 'Beverages', description: 'Drinks', group: 'food' },
  { value: 'personal_care', label: 'Personal care', description: 'Hygiene', group: 'health' },
  { value: 'household', label: 'Household', description: 'Home supplies', group: 'home' },
  { value: 'electronics', label: 'Electronics', description: 'Gadgets', group: 'electronics' },
  { value: 'other', label: 'Other', description: 'Miscellaneous', group: 'general' },
];

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly api = inject(BackOfficeApiService);
  private readonly currentShop = inject(CurrentShopService);

  list(): Observable<Product[]> {
    return this.withStoreId((storeId) =>
      this.api.get<Product[]>('/products', { store_id: storeId }),
    );
  }

  /** `GET /products/categories` — catalog for searchable category dropdown. */
  categories(): Observable<ProductCategoryInfo[]> {
    return this.api.get<ProductCategoryInfo[]>('/products/categories', undefined, 'user').pipe(
      map((rows) => (Array.isArray(rows) && rows.length ? rows : PRODUCT_CATEGORY_FALLBACK)),
      catchError(() => of(PRODUCT_CATEGORY_FALLBACK)),
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

  suggestImages(productName: string): Observable<ProductImageSuggestResponse> {
    return this.api.post<ProductImageSuggestResponse>('/products/images/suggest', {
      product_name: productName.trim(),
    });
  }

  attachImagesFromCdn(productId: string, cdns: string[]): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/images`, { cdns });
  }

  uploadImage(productId: string, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.postFormData<Product>(`/products/${productId}/image/upload`, formData);
  }

  useImageFromCdn(productId: string, cdn: string): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/image/use`, { cdn });
  }

  setImageCdn(productId: string, cdn: string): Observable<Product> {
    return this.api.post<Product>(`/products/${productId}/image/cdn`, { cdn });
  }

  fetchStoredImage(storedImageId: string): Observable<Blob> {
    return this.api.getBlob(`/products/images/${storedImageId}`, 'user');
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
