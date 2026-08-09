import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { resolveApiBaseUrl } from './store.config';

const TOKEN_KEY = 'junction.auth';

@Injectable({ providedIn: 'root' })
export class BackOfficeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = resolveApiBaseUrl();

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http.get<T>(this.url(path), {
      params: new HttpParams({ fromObject: params ?? {} }),
      headers: this.authHeaders(),
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body, { headers: this.authHeaders() });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(path), body, { headers: this.authHeaders() });
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.url(path), body, { headers: this.authHeaders() });
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(this.url(path), { headers: this.authHeaders() });
  }

  private authHeaders(): Record<string, string> {
    const accessToken = this.readAccessToken();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }

  private readAccessToken(): string | null {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return parsed.accessToken ?? null;
    } catch {
      return null;
    }
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
