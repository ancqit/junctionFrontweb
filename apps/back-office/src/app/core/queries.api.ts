import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { ImageSearchResponse, ProductImageSuggestResponse } from './models';

@Injectable({ providedIn: 'root' })
export class QueriesApi {
  private readonly api = inject(BackOfficeApiService);

  /**
   * General Pexels image search (profile avatars, keywords).
   * junctionBack: `GET /queries?query=…&page=…&per_page=…` (Pexels, max 80 per page).
   */
  searchImages(query: string, page = 1, perPage = 10): Observable<ImageSearchResponse> {
    return this.api.get<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page: String(page),
      per_page: String(Math.min(perPage, 10)),
    });
  }

  /** Same search via `POST /queries` body. */
  searchImagesPost(query: string, page = 1, perPage = 10): Observable<ImageSearchResponse> {
    return this.api.post<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page,
      per_page: Math.min(perPage, 10),
    });
  }

  /**
   * Product-name image suggestions (10 results).
   * junctionBack: `POST /queries/suggest-images` `{ product_name }`.
   * Prefer ProductsApi.suggestImages (`POST /products/images/suggest`) on the products page.
   */
  suggestProductImages(productName: string): Observable<ProductImageSuggestResponse> {
    return this.api.post<ProductImageSuggestResponse>('/queries/suggest-images', {
      product_name: productName.trim(),
    });
  }
}
