import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthTokens, OtpChallenge, OtpRequest, OtpVerification } from './auth.models';
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
  verifyOtp(challengeId: string, otp: string): Observable<OtpVerification> {
    return this.api.post<OtpVerification>('/auth/otp/verify', { challengeId, otp }).pipe(tap((value) => this.acceptTokens(value)));
  }
  refresh(): Observable<AuthTokens> {
    return this.api.post<AuthTokens>('/auth/refresh', { refreshToken: this.tokens.refreshToken }).pipe(tap((value) => this.acceptTokens(value)));
  }
  startSession(): void { if (this.tokens.isAuthenticated) this.scheduleRefresh(); }
  logout(): void {
    clearTimeout(this.refreshTimer);
    this.tokens.clear();
    this.authenticated$.next(false);
    void this.router.navigateByUrl('/login');
  }
  private acceptTokens(tokens: AuthTokens): void {
    this.tokens.save(tokens);
    this.authenticated$.next(true);
    this.scheduleRefresh();
  }
  private scheduleRefresh(): void {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.refresh().subscribe({ error: () => this.logout() }), this.tokens.millisecondsUntilRefresh());
  }
}
