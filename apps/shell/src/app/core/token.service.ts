import { Injectable } from '@angular/core';
import { AuthTokens } from './auth.models';

const TOKEN_KEY = 'junction.auth';
interface StoredTokens extends AuthTokens { expiresAt: number }

@Injectable({ providedIn: 'root' })
export class TokenService {
  get accessToken(): string | null { return this.tokens?.accessToken ?? null; }
  get refreshToken(): string | null { return this.tokens?.refreshToken ?? null; }
  get isAuthenticated(): boolean { return !!this.accessToken && (this.tokens?.expiresAt ?? 0) > Date.now(); }

  save(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ ...tokens, expiresAt: Date.now() + tokens.expiresInSeconds * 1000 }));
  }
  saveAccessToken(accessToken: string): void {
    const expiresAt = this.getJwtExpiration(accessToken) ?? Date.now() + 60 * 60_000;
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken, expiresAt }));
  }
  updateAccessToken(accessToken: string): void {
    const tokens = this.tokens;
    if (!tokens) {
      this.saveAccessToken(accessToken);
      return;
    }
    const expiresAt = this.getJwtExpiration(accessToken)
      ?? Date.now() + (tokens.expiresInSeconds ?? 3600) * 1000;
    localStorage.setItem(TOKEN_KEY, JSON.stringify({
      ...tokens,
      accessToken,
      expiresAt,
    }));
  }
  clear(): void { localStorage.removeItem(TOKEN_KEY); }
  millisecondsUntilRefresh(): number {
    return Math.max(0, (this.tokens?.expiresAt ?? 0) - Date.now() - 5 * 60_000);
  }
  private get tokens(): StoredTokens | null {
    try { return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? 'null') as StoredTokens | null; }
    catch { this.clear(); return null; }
  }
  private getJwtExpiration(accessToken: string): number | null {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
