import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
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
    return this.api.get<Notice[] | Notice>('/notices/today', { store_id: trimmed }).pipe(
      map((payload) => {
        if (Array.isArray(payload)) {
          return payload[0] ?? null;
        }
        return payload?.message != null ? payload : null;
      }),
      catchError(() => of(null)),
    );
  }

  postToday(payload: NoticeCreate): Observable<Notice> {
    return this.api.post<Notice>('/notices', payload);
  }

  /** `DELETE /notices/today?store_id=` — removes today's notice for the shop. */
  deleteToday(storeId: string): Observable<void> {
    const trimmed = storeId.trim();
    if (!trimmed) {
      return throwError(() => ({
        status: 400,
        error: { detail: 'Store id is required to delete today’s notice.' },
      }));
    }
    return this.api.delete('/notices/today', { store_id: trimmed }).pipe(
      catchError((err: unknown) => {
        const status = (err as { status?: number })?.status;
        if (status === 404 || status === 405) {
          return throwError(() => ({
            status,
            error: {
              detail:
                'Delete notice is not available on the server yet. Try again after the API update lands.',
            },
          }));
        }
        return throwError(() => err);
      }),
    );
  }
}
