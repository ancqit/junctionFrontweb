import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { homePathForRole, UserRole } from './auth.models';
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
 * Easy to extend later (more roles, permissions, feature flags).
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

  return (): boolean | UrlTree => {
    const tokens = inject(TokenService);
    const session = inject(SessionService);
    const router = inject(Router);
    const loginUrl = options.loginUrl ?? '/login';

    if (!tokens.isAuthenticated) {
      return router.createUrlTree([loginUrl]);
    }

    const role = session.role ?? 'owner';
    if (allowedRoles.includes(role)) {
      return true;
    }

    const forbidden =
      typeof options.forbiddenUrl === 'function'
        ? options.forbiddenUrl(role)
        : (options.forbiddenUrl ?? homePathForRole(role));

    return router.createUrlTree([forbidden]);
  };
}
