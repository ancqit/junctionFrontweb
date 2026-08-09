import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { homePathForRole, UserRole } from './auth.models';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

function requireRole(allowed: UserRole[]): CanActivateFn {
  return () => {
    const tokens = inject(TokenService);
    const session = inject(SessionService);
    const router = inject(Router);

    if (!tokens.isAuthenticated) {
      return router.createUrlTree(['/login']);
    }

    const role = session.role ?? 'owner';
    if (allowed.includes(role)) {
      return true;
    }
    return router.createUrlTree([homePathForRole(role)]);
  };
}

/** Platform admins only — activate / reactivate shop accounts. */
export const adminGuard: CanActivateFn = requireRole(['admin']);

/** Shop owners — full back office. Admins may open it from the admin shell. */
export const ownerGuard: CanActivateFn = requireRole(['owner', 'admin']);

/** Shop-owner viewer — explanatory landing (not admin tools). */
export const viewerGuard: CanActivateFn = requireRole(['viewer']);
