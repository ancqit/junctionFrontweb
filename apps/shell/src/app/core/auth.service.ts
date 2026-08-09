import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { OtpChallenge, OtpRequest, OtpVerification, RefreshResponse } from './auth.models';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokens = inject(TokenService);
  private readonly router = inject(Router);
  private refreshTimer?: ReturnType<typeof setTimeout>;
  readonly authenticated$ = new BehaviorSubject(this.tokens.isAuthenticated);

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
      .pipe(tap((value) => this.acceptAccessToken(value.access_token)));
  }

  refresh(): Observable<RefreshResponse> {
    return this.api.post<RefreshResponse>('/auth/refresh', {}).pipe(
      tap((value) => {
        this.tokens.updateAccessToken(value.access_token);
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

  logout(): void {
    clearTimeout(this.refreshTimer);
    this.tokens.clear();
    this.authenticated$.next(false);
    void this.router.navigateByUrl('/login');
  }

  private acceptAccessToken(accessToken: string): void {
    this.tokens.saveAccessToken(accessToken);
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
