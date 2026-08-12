import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { homePathForRole, normalizeUserRole, UserRole } from './auth.models';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

export type AuthorGuardOptions = {
  /** Where to send unauthenticated users. Defaults to `/login`. */
  loginUrl?: string;
  /**
   * Where to send authenticated users who lack an allowed role.
   * Defaults to that user’s role home (`/admin`, `/viewer`, `/back-office`).
   */
  forbiddenUrl?: string | ((role: UserRole) => string);
};

/**
 * Reusable authorization guard for role-based routes.
 *
 * Use on any route that should only open for specific login roles.
 * Prefer including `'admin'` when a route should stay open to platform admins.
 *
 * @example
 * canActivate: [authGuard, authorGuard('admin')]
 * canActivate: [authGuard, authorGuard(['owner', 'admin'])]
 */
export function authorGuard(
  allowed: UserRole | UserRole[],
  options: AuthorGuardOptions = {},
): CanActivateFn {
  const allowedRoles = (Array.isArray(allowed) ? allowed : [allowed]) as UserRole[];

  return (): boolean | UrlTree | Observable<boolean | UrlTree> => {
    const tokens = inject(TokenService);
    const session = inject(SessionService);
    const auth = inject(AuthService);
    const router = inject(Router);
    const loginUrl = options.loginUrl ?? '/login';

    if (!tokens.isAuthenticated) {
      return router.parseUrl(loginUrl);
    }

    const localRole = session.role ?? (session.user ? normalizeUserRole(session.user) : null);
    if (localRole && allowedRoles.includes(localRole)) {
      return true;
    }

    // JWT present but role missing/stale (admin often stored as owner locally) —
    // rehydrate from junctionBack GET /auth/me before bouncing away.
    return auth.ensureSessionRole(true).pipe(
      map((role) => {
        if (allowedRoles.includes(role)) {
          return true;
        }
        const forbidden =
          typeof options.forbiddenUrl === 'function'
            ? options.forbiddenUrl(role)
            : (options.forbiddenUrl ?? homePathForRole(role));
        return router.parseUrl(forbidden);
      }),
      catchError((err: unknown) => {
        const status = (err as { status?: number })?.status;
        if (status === 401) {
          return of(router.parseUrl(loginUrl));
        }
        const fallback = localRole ?? 'owner';
        return of(router.parseUrl(homePathForRole(fallback)));
      }),
    );
  };
}
