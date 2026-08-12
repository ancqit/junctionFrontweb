import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, finalize, of, shareReplay, switchMap, throwError } from 'rxjs';
import { API_CONFIG } from './api.config';

const STORAGE_KEY = 'junction.guestSession';
const REFRESH_SKEW_MS = 15_000;

interface GuestSessionResponse {
  session_id: string;
  access_token: string;
  expires_in: number;
}

interface StoredGuestSession {
  sessionId: string;
  accessToken: string;
  expiresAt: number;
}

/** junctionBack `POST /session` guest JWT for JunctionSession routes. */
@Injectable({ providedIn: 'root' })
export class GuestSessionService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private inFlight$: Observable<string> | null = null;

  ensureAccessToken(): Observable<string> {
    const existing = this.read();
    if (existing && existing.expiresAt > Date.now() + REFRESH_SKEW_MS) {
      return of(existing.accessToken);
    }
    return this.mint();
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.inFlight$ = null;
  }

  private mint(): Observable<string> {
    if (!this.inFlight$) {
      this.inFlight$ = this.http
        .post<GuestSessionResponse>(`${this.config.baseUrl.replace(/\/$/, '')}/session`, {})
        .pipe(
          switchMap((response) => {
            const token = response?.access_token?.trim();
            if (!token) {
              return throwError(() => new Error('Guest session missing access_token'));
            }
            const expiresInMs = Math.max(1, Number(response.expires_in) || 100) * 1000;
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                sessionId: response.session_id,
                accessToken: token,
                expiresAt: Date.now() + expiresInMs,
              } satisfies StoredGuestSession),
            );
            return of(token);
          }),
          finalize(() => {
            this.inFlight$ = null;
          }),
          shareReplay({ bufferSize: 1, refCount: true }),
        );
    }
    return this.inFlight$;
  }

  private read(): StoredGuestSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as StoredGuestSession;
      if (!parsed?.accessToken || !parsed.expiresAt) {
        return null;
      }
      return parsed;
    } catch {
      this.clear();
      return null;
    }
  }
}
