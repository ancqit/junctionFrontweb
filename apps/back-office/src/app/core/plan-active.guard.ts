import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { PlanAccessService } from './plan-access.service';
import { ShopLockService } from './shop-lock.service';

const OPEN_WHEN_VIEWER = new Set(['shops', 'plans', 'activate']);

/**
 * After plan + grace end the user is a viewer (deactivated).
 * Per-shop lock puts the active shop in viewer mode with the same restrictions.
 * Shops, Plans, and Activate stay open so the user can renew or switch shops.
 */
export const planActiveGuard: CanActivateFn = (route) => {
  const access = inject(PlanAccessService);
  const shopLock = inject(ShopLockService);
  const router = inject(Router);
  const path = route.routeConfig?.path ?? '';

  const resolve = (): boolean | ReturnType<Router['createUrlTree']> => {
    if (OPEN_WHEN_VIEWER.has(path)) {
      return true;
    }
    if (access.locked()) {
      return router.createUrlTree(['/back-office/activate'], { queryParams: { scope: 'account' } });
    }
    if (shopLock.activeLocked()) {
      return router.createUrlTree(['/back-office/activate'], { queryParams: { scope: 'shop' } });
    }
    return true;
  };

  if (!access.loading() && (access.plan() || access.isViewer())) {
    return resolve();
  }

  return access.refresh().pipe(map(() => resolve()));
};
