import { CanActivateFn } from '@angular/router';
import { authorGuard } from './author.guard';

/** Platform admins only — shops console (activate / deactivate). */
export const adminGuard: CanActivateFn = authorGuard('admin');

/**
 * Full shop application (back office).
 * Admins included for platform access.
 * Viewers included so post-grace deactivated accounts can open Activate + Plans.
 */
export const ownerGuard: CanActivateFn = authorGuard(['owner', 'admin', 'viewer']);

/**
 * Viewer = deactivated after Premium/trial + grace end (not an owner).
 * Home is `/back-office/activate`.
 */
export const viewerGuard: CanActivateFn = authorGuard('viewer');
