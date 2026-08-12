import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { API_CONFIG } from './api.config';
import { ApiAuthMode, resolveApiAuthMode } from './api-auth';
import { GuestSessionService } from './guest-session.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly tokens = inject(TokenService);
  private readonly guestSession = inject(GuestSessionService);

  get<T>(path: string, params?: Record<string, string>, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('GET', path, auth, (headers) =>
      this.http.get<T>(this.url(path), {
        params: new HttpParams({ fromObject: params ?? {} }),
        headers,
      }),
    );
  }

  post<T>(path: string, body: unknown = {}, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('POST', path, auth, (headers) =>
      this.http.post<T>(this.url(path), body, { headers }),
    );
  }

  patch<T>(path: string, body: unknown, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('PATCH', path, auth, (headers) =>
      this.http.patch<T>(this.url(path), body, { headers }),
    );
  }

  put<T>(path: string, body: unknown, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('PUT', path, auth, (headers) =>
      this.http.put<T>(this.url(path), body, { headers }),
    );
  }

  delete<T>(path: string, body?: unknown, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('DELETE', path, auth, (headers) =>
      this.http.request<T>('DELETE', this.url(path), {
        body,
        headers,
      }),
    );
  }

  private withAuthHeaders<T>(
    method: string,
    path: string,
    explicit: ApiAuthMode | undefined,
    run: (headers: Record<string, string>) => Observable<T>,
  ): Observable<T> {
    const mode = resolveApiAuthMode(path, method, explicit);
    if (mode === 'none') {
      return run({});
    }
    if (mode === 'session') {
      return this.guestSession.ensureAccessToken().pipe(
        switchMap((token) => run({ Authorization: `Bearer ${token}` })),
      );
    }
    const accessToken = this.tokens.accessToken;
    return run(accessToken ? { Authorization: `Bearer ${accessToken}` } : {});
  }

  private url(path: string): string {
    return `${this.config.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
