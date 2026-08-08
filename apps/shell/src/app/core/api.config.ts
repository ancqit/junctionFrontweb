import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  // factory: () => ({ baseUrl: 'https://junctionback.onrender.com' }),
  factory: () => ({ baseUrl: 'http://localhost:8000' }),
});
