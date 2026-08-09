import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { ImageSearchResponse } from './models';

@Injectable({ providedIn: 'root' })
export class QueriesApi {
  private readonly api = inject(BackOfficeApiService);

  /**
   * Search CDN product pictures via junctionBack GET /queries.
   * Response images include cdn_url for attaching to a product.
   */
  searchImages(query: string, page = 1, perPage = 12): Observable<ImageSearchResponse> {
    return this.api.get<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page: String(page),
      per_page: String(perPage),
    });
  }

  /** Same search via POST /queries body. */
  searchImagesPost(query: string, page = 1, perPage = 12): Observable<ImageSearchResponse> {
    return this.api.post<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page,
      per_page: perPage,
    });
  }
}
