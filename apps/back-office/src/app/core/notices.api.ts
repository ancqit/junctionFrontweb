import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';

/** junctionBack `Notice` (`GET /notices`, `POST /notices`). */
export interface Notice {
  id: string;
  store_id: string;
  message: string;
  notice_date: string;
  created_at: string;
  updated_at: string;
}

/** junctionBack `NoticeCreate` (`POST /notices`). */
export interface NoticeCreate {
  store_id: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NoticesApi {
  private readonly api = inject(BackOfficeApiService);

  listToday(): Observable<Notice[]> {
    return this.api.get<Notice[]>('/notices').pipe(catchError(() => of([])));
  }

  getToday(storeId: string): Observable<Notice | null> {
    const trimmed = storeId.trim();
    if (!trimmed) {
      return of(null);
    }
    return this.api.get<Notice>('/notices/today', { store_id: trimmed }).pipe(catchError(() => of(null)));
  }

  postToday(payload: NoticeCreate): Observable<Notice> {
    return this.api.post<Notice>('/notices', payload);
  }
}
