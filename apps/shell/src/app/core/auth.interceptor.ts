import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_CONFIG } from './api.config';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(API_CONFIG);
  const tokens = inject(TokenService);
  const auth = inject(AuthService);
  const isApiCall = request.url.startsWith(config.baseUrl);
  const isAuthCall = request.url.includes('/auth/otp/') || request.url.includes('/auth/refresh');
  const outgoing = isApiCall && tokens.accessToken
    ? request.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } })
    : request;
  return next(outgoing).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status !== 401 || !isApiCall || isAuthCall || !tokens.refreshToken) return throwError(() => error);
    return auth.refresh().pipe(
      switchMap(() => next(request.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } }))),
      catchError((refreshError) => { auth.logout(); return throwError(() => refreshError); }),
    );
  }));
};
