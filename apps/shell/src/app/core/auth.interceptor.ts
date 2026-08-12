import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_CONFIG } from './api.config';
import { resolveApiAuthMode } from './api-auth';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

/**
 * Attaches junctionBack user access JWT for `user`-mode API calls and retries once via
 * POST /auth/refresh on 401. Does not override guest-session Bearer headers, and never
 * runs user refresh for public / session-auth routes.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(API_CONFIG);
  const tokens = inject(TokenService);
  const auth = inject(AuthService);
  const isApiCall = request.url.startsWith(config.baseUrl);
  const apiPath = isApiCall
    ? request.url.slice(config.baseUrl.replace(/\/$/, '').length) || '/'
    : '';
  const authMode = isApiCall ? resolveApiAuthMode(apiPath, request.method) : 'none';
  const isAuthCall =
    request.url.includes('/auth/otp/') ||
    request.url.includes('/auth/refresh') ||
    request.url.includes('/auth/login') ||
    request.url.includes('/auth/register') ||
    request.url.includes('/session');

  const existingAuth = request.headers.get('Authorization');
  const outgoing =
    isApiCall && authMode === 'user' && tokens.accessToken && !existingAuth
      ? request.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } })
      : request;

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        !isApiCall ||
        isAuthCall ||
        authMode !== 'user' ||
        !tokens.accessToken
      ) {
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
          // Do not logout on network/5xx — that bounced shell → back-office → login.
          if (status === 401) {
            auth.logout();
          }
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
