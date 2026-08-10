import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { ImageSearchResponse } from './models';

@Injectable({ providedIn: 'root' })
export class QueriesApi {
  private readonly api = inject(BackOfficeApiService);

  /**
   * Generate CDN pictures from a keyword via junctionBack Gemini image API.
   * `GET /queries?query=…&per_page=…` (max 10 on backend).
   */
  searchImages(query: string, page = 1, perPage = 10): Observable<ImageSearchResponse> {
    return this.api.get<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page: String(page),
      per_page: String(Math.min(perPage, 10)),
    });
  }

  /** Same search via POST /queries body. */
  searchImagesPost(query: string, page = 1, perPage = 10): Observable<ImageSearchResponse> {
    return this.api.post<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page,
      per_page: Math.min(perPage, 10),
    });
  }
}
