import { CanActivateFn } from '@angular/router';
import { authorGuard } from './author.guard';

/** Platform admins only — shops console (activate / deactivate). */
export const adminGuard: CanActivateFn = authorGuard('admin');

/**
 * Full shop application (back office).
 * Admins are included so an admin login ID can use the entire app as well as /admin.
 */
export const ownerGuard: CanActivateFn = authorGuard(['owner', 'admin']);

/** Shop-owner viewer — explanatory landing (not admin tools). */
export const viewerGuard: CanActivateFn = authorGuard('viewer');
