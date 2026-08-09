import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

const AUTH_KEY = 'junction.auth';
const SESSION_KEY = 'junction.session';

/** Clears shell auth/session storage and returns to login. */
@Injectable({ providedIn: 'root' })
export class LogoutService {
  private readonly router = inject(Router);

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SESSION_KEY);
    void this.router.navigateByUrl('/login');
  }
}
