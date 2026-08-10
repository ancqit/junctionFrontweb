import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { DescriptionResponse } from './models';

@Injectable({ providedIn: 'root' })
export class DescriptionsApi {
  private readonly api = inject(BackOfficeApiService);

  /**
   * Enhance a short prompt into fuller copy via Gemini.
   * junctionBack: `POST /descriptions/generate` `{ text }` → `{ description }`.
   */
  generate(text: string): Observable<DescriptionResponse> {
    return this.api.post<DescriptionResponse>('/descriptions/generate', {
      text: text.trim(),
    });
  }
}
