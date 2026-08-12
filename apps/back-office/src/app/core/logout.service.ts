import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

const AUTH_KEY = 'junction.auth';
const SESSION_KEY = 'junction.session';
const GUEST_SESSION_KEY = 'junction.guestSession';

/**
 * Clears shell auth keys used by TokenService / SessionService / GuestSessionService.
 * Hard-navigates to /login so the shell DI state cannot keep a stale in-memory session
 * (back-office is a federated remote and cannot call shell AuthService.logout directly).
 */
@Injectable({ providedIn: 'root' })
export class LogoutService {
  private readonly router = inject(Router);

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(GUEST_SESSION_KEY);
    // Full reload resets shell AuthService/SessionService memory and stops refresh timers.
    if (typeof window !== 'undefined') {
      window.location.assign('/login');
      return;
    }
    void this.router.navigateByUrl('/login');
  }
}
