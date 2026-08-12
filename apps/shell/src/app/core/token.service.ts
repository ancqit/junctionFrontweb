import { Injectable } from '@angular/core';
import { AuthTokens } from './auth.models';

const TOKEN_KEY = 'junction.auth';
/** Refresh this long before JWT exp (junctionBack access token). */
const REFRESH_SKEW_MS = 5 * 60_000;
/** Never schedule an immediate refresh after login (avoids bounce-to-login races). */
const MIN_REFRESH_DELAY_MS = 30_000;
/** If JWT exp is missing/unusable, assume this lifetime. */
const FALLBACK_TTL_MS = 60 * 60_000;

interface StoredTokens extends AuthTokens {
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  get accessToken(): string | null {
    const token = this.tokens?.accessToken?.trim();
    return token ? token : null;
  }

  get refreshToken(): string | null {
    return this.tokens?.refreshToken ?? null;
  }

  /**
   * Guards should treat a stored access JWT as signed-in.
   * Expiry is enforced by junctionBack (401) + refresh — not by a strict client clock check,
   * which was bouncing shell → /back-office → /login when exp parsing/clock skew disagreed.
   */
  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /** True when client-side exp says the access JWT is past due (used for refresh scheduling). */
  get isExpired(): boolean {
    const token = this.accessToken;
    if (!token) {
      return true;
    }
    const expiresAt = this.tokens?.expiresAt;
    if (!expiresAt) {
      return false;
    }
    return expiresAt <= Date.now();
  }

  save(tokens: AuthTokens): void {
    if (!tokens.accessToken?.trim()) {
      return;
    }
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({
        ...tokens,
        accessToken: tokens.accessToken.trim(),
        expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
      }),
    );
  }

  saveAccessToken(accessToken: string): void {
    const trimmed = accessToken?.trim();
    if (!trimmed) {
      return;
    }
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({ accessToken: trimmed, expiresAt: this.resolveExpiresAt(trimmed) }),
    );
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
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({
        ...tokens,
        accessToken: trimmed,
        expiresAt: this.resolveExpiresAt(trimmed, tokens.expiresInSeconds),
      }),
    );
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  millisecondsUntilRefresh(): number {
    const expiresAt = this.tokens?.expiresAt ?? Date.now() + FALLBACK_TTL_MS;
    const untilSkew = expiresAt - Date.now() - REFRESH_SKEW_MS;
    return Math.max(MIN_REFRESH_DELAY_MS, untilSkew);
  }

  private resolveExpiresAt(accessToken: string, fallbackSeconds?: number): number {
    const fallback = Date.now() + (fallbackSeconds ? fallbackSeconds * 1000 : FALLBACK_TTL_MS);
    const jwtExp = this.getJwtExpiration(accessToken);
    // Never persist an already-expired exp for a freshly issued token (clock skew / parse issues).
    if (jwtExp != null && jwtExp > Date.now() + MIN_REFRESH_DELAY_MS) {
      return jwtExp;
    }
    return fallback;
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
      const payload = JSON.parse(atob(padded)) as { exp?: number | string };
      const exp =
        typeof payload.exp === 'number'
          ? payload.exp
          : typeof payload.exp === 'string'
            ? Number(payload.exp)
            : NaN;
      return Number.isFinite(exp) && exp > 0 ? exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
