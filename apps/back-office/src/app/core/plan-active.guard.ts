import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { PlanAccessService } from './plan-access.service';

/** Blocks app features after grace/trial expiry; Plans + Activate remain reachable. */
export const planActiveGuard: CanActivateFn = () => {
  const access = inject(PlanAccessService);
  const router = inject(Router);

  if (!access.loading() && access.plan()) {
    return access.locked() ? router.createUrlTree(['/back-office/activate']) : true;
  }

  return access.refresh().pipe(
    map(() => (access.locked() ? router.createUrlTree(['/back-office/activate']) : true)),
  );
};
