import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { ImageSearchResponse } from './models';

@Injectable({ providedIn: 'root' })
export class QueriesApi {
  private readonly api = inject(BackOfficeApiService);

  searchImages(query: string, page = 1, perPage = 12): Observable<ImageSearchResponse> {
    return this.api.get<ImageSearchResponse>('/queries', {
      query: query.trim(),
      page: String(page),
      per_page: String(perPage),
    });
  }
}
