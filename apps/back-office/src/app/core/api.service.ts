import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ApiAuthMode, resolveApiAuthMode } from './api-auth';
import { GuestSessionService } from './guest-session.service';
import { resolveApiBaseUrl } from './store.config';

const TOKEN_KEY = 'junction.auth';

@Injectable({ providedIn: 'root' })
export class BackOfficeApiService {
  private readonly http = inject(HttpClient);
  private readonly guestSession = inject(GuestSessionService);
  private readonly baseUrl = resolveApiBaseUrl();

  get<T>(path: string, params?: Record<string, string>, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('GET', path, auth, (headers) =>
      this.http.get<T>(this.url(path), {
        params: new HttpParams({ fromObject: params ?? {} }),
        headers,
      }),
    );
  }

  post<T>(path: string, body: unknown, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('POST', path, auth, (headers) =>
      this.http.post<T>(this.url(path), body, { headers }),
    );
  }

  postFormData<T>(path: string, formData: FormData, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('POST', path, auth, (headers) =>
      this.http.post<T>(this.url(path), formData, { headers }),
    );
  }

  put<T>(path: string, body: unknown, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('PUT', path, auth, (headers) =>
      this.http.put<T>(this.url(path), body, { headers }),
    );
  }

  patch<T>(path: string, body: unknown, auth?: ApiAuthMode): Observable<T> {
    return this.withAuthHeaders('PATCH', path, auth, (headers) =>
      this.http.patch<T>(this.url(path), body, { headers }),
    );
  }

  delete(path: string, params?: Record<string, string>, auth?: ApiAuthMode): Observable<void> {
    return this.withAuthHeaders('DELETE', path, auth, (headers) =>
      this.http.delete<void>(this.url(path), {
        params: new HttpParams({ fromObject: params ?? {} }),
        headers,
      }),
    );
  }

  /** Binary GET (e.g. CatalogReader `GET /products/images/:id`) with the correct Bearer. */
  getBlob(path: string, auth?: ApiAuthMode): Observable<Blob> {
    return this.withAuthHeaders('GET', path, auth, (headers) =>
      this.http.get(this.url(path), { headers, responseType: 'blob' }),
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
    const accessToken = this.readAccessToken();
    return run(accessToken ? { Authorization: `Bearer ${accessToken}` } : {});
  }

  private readAccessToken(): string | null {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as { accessToken?: string };
      const token = parsed.accessToken?.trim();
      return token ? token : null;
    } catch {
      return null;
    }
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
