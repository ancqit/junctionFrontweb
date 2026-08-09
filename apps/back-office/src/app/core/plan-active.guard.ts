import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { PlanAccessService } from './plan-access.service';

/**
 * After plan + grace end the user is a viewer (deactivated).
 * Feature routes redirect to the deactivated Activate view; Plans stay open.
 */
export const planActiveGuard: CanActivateFn = () => {
  const access = inject(PlanAccessService);
  const router = inject(Router);

  if (!access.loading() && (access.plan() || access.isViewer())) {
    return access.locked() ? router.createUrlTree(['/back-office/activate']) : true;
  }

  return access.refresh().pipe(
    map(() => (access.locked() ? router.createUrlTree(['/back-office/activate']) : true)),
  );
};
