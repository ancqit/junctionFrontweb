import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_CONFIG } from './api.config';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

/**
 * Attaches junctionBack Bearer access JWT and retries once via POST /auth/refresh on 401.
 * Only logs out when refresh fails with 401 (invalid/expired token) — not on network blips.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(API_CONFIG);
  const tokens = inject(TokenService);
  const auth = inject(AuthService);
  const isApiCall = request.url.startsWith(config.baseUrl);
  const isAuthCall =
    request.url.includes('/auth/otp/') ||
    request.url.includes('/auth/refresh') ||
    request.url.includes('/auth/login') ||
    request.url.includes('/auth/register');

  const outgoing =
    isApiCall && tokens.accessToken
      ? request.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } })
      : request;

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || !isApiCall || isAuthCall || !tokens.accessToken) {
        return throwError(() => error);
      }
      return auth.refresh().pipe(
        switchMap(() => {
          const latest = tokens.accessToken;
          if (!latest) {
            return throwError(() => error);
          }
          return next(request.clone({ setHeaders: { Authorization: `Bearer ${latest}` } }));
        }),
        catchError((refreshError: unknown) => {
          const status = (refreshError as HttpErrorResponse)?.status;
          // junctionBack returns 401 for invalid/expired access tokens — only then clear session.
          if (status === 401 || tokens.isExpired) {
            auth.logout();
          }
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
