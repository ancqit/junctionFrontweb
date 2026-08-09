import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
}

function resolveApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  // Same-origin /api is rewritten by Vercel to https://junctionback.onrender.com
  // so the browser never makes a cross-origin call to Render.
  return isLocal ? 'http://localhost:8000' : '/api';
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({ baseUrl: resolveApiBaseUrl() }),
});
