import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from './token.service';

export const authGuard: CanActivateFn = () => {
  return inject(TokenService).isAuthenticated
    ? true
    : inject(Router).parseUrl('/login');
};
