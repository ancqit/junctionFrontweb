import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, finalize, shareReplay, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  homePathForRole,
  OtpChallenge,
  OtpRequest,
  OtpVerification,
  RefreshResponse,
  resolveLoginRole,
  UserRole,
} from './auth.models';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokens = inject(TokenService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private refreshTimer?: ReturnType<typeof setTimeout>;
  /** Single-flight refresh so parallel 401s do not stampede POST /auth/refresh. */
  private refreshInFlight$: Observable<RefreshResponse> | null = null;
  readonly authenticated$ = new BehaviorSubject(this.tokens.isAuthenticated);

  get role(): UserRole | null {
    return this.session.role;
  }

  /** Login user id from OTP / refresh (admin identity for the console). */
  get userId(): string | null {
    return this.session.user?.id ?? null;
  }

  get displayName(): string | null {
    return this.session.user?.display_name ?? null;
  }

  requestOtp(payload: OtpRequest): Observable<OtpChallenge> {
    return this.api.post<OtpChallenge>('/auth/otp/request', payload);
  }

  verifyOtp(otp: string, phoneNumber: string, sessionInfo: string): Observable<OtpVerification> {
    return this.api
      .post<OtpVerification>('/auth/otp/verify', {
        otp,
        phone_number: phoneNumber,
        session_info: sessionInfo,
      })
      .pipe(tap((value) => this.acceptSession(value)));
  }

  /**
   * junctionBack `POST /auth/refresh` — re-issues access JWT using the current Bearer token.
   * Shared across interceptor retries so concurrent 401s do not clear a fresh login.
   */
  refresh(): Observable<RefreshResponse> {
    if (!this.tokens.accessToken) {
      return throwError(() => new Error('No access token to refresh'));
    }
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.api.post<RefreshResponse>('/auth/refresh', {}).pipe(
        tap((value) => {
          if (!value?.access_token) {
            return;
          }
          this.tokens.updateAccessToken(value.access_token);
          this.persistUser(value);
          this.authenticated$.next(true);
          this.scheduleRefresh();
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
        finalize(() => {
          this.refreshInFlight$ = null;
        }),
      );
    }
    return this.refreshInFlight$;
  }

  startSession(): void {
    if (this.tokens.isAuthenticated) {
      this.scheduleRefresh();
    }
  }

  homePath(): string {
    return homePathForRole(this.session.role ?? 'owner');
  }

  logout(): void {
    clearTimeout(this.refreshTimer);
    this.refreshInFlight$ = null;
    this.tokens.clear();
    this.session.clear();
    this.authenticated$.next(false);
    void this.router.navigateByUrl('/login');
  }

  private acceptSession(value: RefreshResponse): void {
    if (!value?.access_token) {
      return;
    }
    clearTimeout(this.refreshTimer);
    this.refreshInFlight$ = null;
    this.tokens.saveAccessToken(value.access_token);
    this.persistUser(value);
    this.authenticated$.next(true);
    this.scheduleRefresh();
  }

  private persistUser(value: RefreshResponse): void {
    if (!value.user) {
      return;
    }
    // Admins never upgrade/downgrade — resolveLoginRole keeps them as admin.
    const role = resolveLoginRole(value.user, value.role ?? value.user.role, value.plan);
    this.session.saveFromAuthUser(value.user, role);
  }

  private scheduleRefresh(): void {
    clearTimeout(this.refreshTimer);
    if (!this.tokens.isAuthenticated) {
      return;
    }
    this.refreshTimer = setTimeout(() => {
      this.refresh().subscribe({
        error: (err: unknown) => {
          const status = (err as { status?: number })?.status;
          // Only end the session when junctionBack rejects the access JWT.
          if (status === 401) {
            this.logout();
            return;
          }
          if (this.tokens.isAuthenticated) {
            this.scheduleRefresh();
          }
        },
      });
    }, this.tokens.millisecondsUntilRefresh());
  }
}
