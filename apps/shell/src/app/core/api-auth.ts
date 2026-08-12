/**
 * junctionBack auth modes — keep in sync with back-office `api-auth.ts`.
 *
 * - `none`     Public
 * - `session`  Guest session JWT (POST /session) — required for /locations/*
 * - `user`     Owner/admin access JWT — AuthenticatedUser + preferred CatalogReader mode here
 */
export type ApiAuthMode = 'none' | 'session' | 'user';

const PUBLIC_EXACT = new Set([
  '/session',
  '/terms-and-conditions',
  '/health',
  '/auth/otp/request',
  '/auth/otp/verify',
  '/auth/login',
  '/auth/register',
  '/auth/recaptcha-params',
]);

export function requiresGuestSession(path: string): boolean {
  const normalized = normalizePath(path);
  return normalized === '/locations/cities' ||
    normalized === '/locations/localities' ||
    normalized === '/locations/add-junction' ||
    normalized.startsWith('/locations/');
}

export function resolveApiAuthMode(path: string, method: string, explicit?: ApiAuthMode): ApiAuthMode {
  if (explicit) {
    return explicit;
  }
  const normalized = normalizePath(path);
  const m = method.toUpperCase();

  if (PUBLIC_EXACT.has(normalized) || (normalized === '/plans' && m === 'GET')) {
    return 'none';
  }
  if (requiresGuestSession(normalized)) {
    return 'session';
  }
  return 'user';
}

function normalizePath(path: string): string {
  const bare = path.split('?')[0] ?? path;
  const withSlash = bare.startsWith('/') ? bare : `/${bare}`;
  return withSlash.replace(/\/+$/, '') || '/';
}
