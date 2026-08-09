import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import {
  homePathForRole,
  OtpChallenge,
  OtpRequest,
  OtpVerification,
  RefreshResponse,
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

  refresh(): Observable<RefreshResponse> {
    return this.api.post<RefreshResponse>('/auth/refresh', {}).pipe(
      tap((value) => {
        this.tokens.updateAccessToken(value.access_token);
        if (value.user) {
          this.session.saveFromAuthUser(value.user);
        }
        this.authenticated$.next(true);
        this.scheduleRefresh();
      }),
    );
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
    this.tokens.clear();
    this.session.clear();
    this.authenticated$.next(false);
    void this.router.navigateByUrl('/login');
  }

  private acceptSession(value: RefreshResponse): void {
    this.tokens.saveAccessToken(value.access_token);
    if (value.user) {
      this.session.saveFromAuthUser(value.user);
    }
    this.authenticated$.next(true);
    this.scheduleRefresh();
  }

  private scheduleRefresh(): void {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(
      () => this.refresh().subscribe({ error: () => this.logout() }),
      this.tokens.millisecondsUntilRefresh(),
    );
  }
}
