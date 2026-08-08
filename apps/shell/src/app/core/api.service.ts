import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http.get<T>(this.url(path), {
      params: new HttpParams({ fromObject: params ?? {} }),
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  private url(path: string): string {
    return `${this.config.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
