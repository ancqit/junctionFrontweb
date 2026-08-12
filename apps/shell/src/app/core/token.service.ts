import { Injectable } from '@angular/core';
import { AuthTokens } from './auth.models';

const TOKEN_KEY = 'junction.auth';
/** Refresh at least this long before expiry, but never schedule an immediate refresh. */
const REFRESH_SKEW_MS = 5 * 60_000;
const MIN_REFRESH_DELAY_MS = 30_000;

interface StoredTokens extends AuthTokens {
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  get accessToken(): string | null {
    return this.tokens?.accessToken ?? null;
  }

  get refreshToken(): string | null {
    return this.tokens?.refreshToken ?? null;
  }

  get isAuthenticated(): boolean {
    const token = this.accessToken;
    if (!token) {
      return false;
    }
    const expiresAt = this.tokens?.expiresAt ?? 0;
    return expiresAt > Date.now();
  }

  /** True when the access token is missing or past exp (junctionBack JWT). */
  get isExpired(): boolean {
    const token = this.accessToken;
    if (!token) {
      return true;
    }
    return (this.tokens?.expiresAt ?? 0) <= Date.now();
  }

  save(tokens: AuthTokens): void {
    if (!tokens.accessToken?.trim()) {
      return;
    }
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({
        ...tokens,
        expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
      }),
    );
  }

  saveAccessToken(accessToken: string): void {
    const trimmed = accessToken?.trim();
    if (!trimmed) {
      return;
    }
    const expiresAt = this.getJwtExpiration(trimmed) ?? Date.now() + 60 * 60_000;
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken: trimmed, expiresAt }));
  }

  updateAccessToken(accessToken: string): void {
    const trimmed = accessToken?.trim();
    if (!trimmed) {
      return;
    }
    const tokens = this.tokens;
    if (!tokens) {
      this.saveAccessToken(trimmed);
      return;
    }
    const expiresAt =
      this.getJwtExpiration(trimmed) ?? Date.now() + (tokens.expiresInSeconds ?? 3600) * 1000;
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({
        ...tokens,
        accessToken: trimmed,
        expiresAt,
      }),
    );
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Delay until proactive refresh (junctionBack `POST /auth/refresh` uses the access JWT).
   * Never returns 0 — an immediate refresh-on-login was bouncing users back to /login
   * when refresh failed for transient reasons.
   */
  millisecondsUntilRefresh(): number {
    const expiresAt = this.tokens?.expiresAt ?? 0;
    const untilSkew = expiresAt - Date.now() - REFRESH_SKEW_MS;
    return Math.max(MIN_REFRESH_DELAY_MS, untilSkew);
  }

  private get tokens(): StoredTokens | null {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? 'null') as StoredTokens | null;
    } catch {
      this.clear();
      return null;
    }
  }

  private getJwtExpiration(accessToken: string): number | null {
    try {
      const segment = accessToken.split('.')[1];
      if (!segment) {
        return null;
      }
      const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
      const payload = JSON.parse(atob(padded)) as { exp?: number };
      return typeof payload.exp === 'number' && payload.exp > 0 ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
