import { CanActivateFn } from '@angular/router';
import { authorGuard } from './author.guard';

/** Platform admins only — activate / reactivate shop accounts. */
export const adminGuard: CanActivateFn = authorGuard('admin');

/** Shop owners — full back office. Admins may open it from the admin shell. */
export const ownerGuard: CanActivateFn = authorGuard(['owner', 'admin']);

/** Shop-owner viewer — explanatory landing (not admin tools). */
export const viewerGuard: CanActivateFn = authorGuard('viewer');
