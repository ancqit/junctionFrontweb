import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, finalize, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { resolveApiBaseUrl } from './store.config';

const STORAGE_KEY = 'junction.guestSession';
/** Refresh this long before session JWT exp (backend default SESSION_EXPIRE_SECONDS ≈ 100). */
const REFRESH_SKEW_MS = 15_000;

interface GuestSessionResponse {
  session_id: string;
  access_token: string;
  token_type?: string;
  expires_in: number;
  audience?: string;
}

interface StoredGuestSession {
  sessionId: string;
  accessToken: string;
  expiresAt: number;
}

/**
 * junctionBack `POST /session` — short-lived guest JWT for JunctionSession routes
 * (cities, localities, add-junction) and optional CatalogReader reads.
 */
@Injectable({ providedIn: 'root' })
export class GuestSessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = resolveApiBaseUrl();
  private inFlight$: Observable<string> | null = null;

  /** Returns a valid guest session access token, minting/refreshing as needed. */
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
        .post<GuestSessionResponse>(`${this.baseUrl.replace(/\/$/, '')}/session`, {})
        .pipe(
          switchMap((response) => {
            const token = response?.access_token?.trim();
            if (!token) {
              return throwError(() => new Error('Guest session missing access_token'));
            }
            const expiresInMs = Math.max(1, Number(response.expires_in) || 100) * 1000;
            const stored: StoredGuestSession = {
              sessionId: response.session_id,
              accessToken: token,
              expiresAt: Date.now() + expiresInMs,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
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
