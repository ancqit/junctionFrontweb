/**
 * junctionBack auth modes (see app/session.py + access_control.py):
 *
 * - `none`     Public (no Bearer).
 * - `session`  Guest session JWT from POST /session (`typ=junction_session`, aud=junction.today).
 *              Required for /locations/* (cities, localities, add-junction).
 *              Also accepted by CatalogReader (shops/products catalog reads).
 * - `user`     Owner/admin access JWT from OTP login (`get_current_user` / AuthenticatedUser).
 *              Required for mutations + owner-scoped reads (profile, orders, employees, …).
 *              Also accepted by CatalogReader — prefer `user` in this app so GET /shops and
 *              GET /products stay owner-scoped (session JWT returns the public catalog).
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
  '/auth/roles',
]);

/** Paths that require a junction.today session JWT (JunctionSession). */
export function requiresGuestSession(path: string): boolean {
  const normalized = normalizePath(path);
  return (
    normalized === '/locations/cities' ||
    normalized === '/locations/localities' ||
    normalized === '/locations/add-junction' ||
    normalized.startsWith('/locations/')
  );
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
  // Owner-scoped catalog reads keep the user access JWT.
  return 'user';
}

function normalizePath(path: string): string {
  const bare = path.split('?')[0] ?? path;
  const withSlash = bare.startsWith('/') ? bare : `/${bare}`;
  return withSlash.replace(/\/+$/, '') || '/';
}
