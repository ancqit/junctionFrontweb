import { InjectionToken } from '@angular/core';
import { resolveApiBaseUrl } from '../../../../../shared/api-base-url';

export interface ApiConfig {
  baseUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({ baseUrl: resolveApiBaseUrl() }),
});
