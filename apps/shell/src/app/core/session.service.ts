import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser, UserRole, normalizeUserRole } from './auth.models';

const SESSION_KEY = 'junction.session';

interface StoredSession {
  user: AuthUser;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly session$ = new BehaviorSubject<StoredSession | null>(this.read());

  get user(): AuthUser | null {
    return this.session$.value?.user ?? null;
  }

  get role(): UserRole | null {
    return this.session$.value?.role ?? null;
  }

  readonly changes$ = this.session$.asObservable();

  saveFromAuthUser(user: AuthUser, explicitRole?: UserRole | string | null): UserRole {
    const role = normalizeUserRole(user, explicitRole);
    const next: StoredSession = {
      user: { ...user, role },
      role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    this.session$.next(next);
    return role;
  }

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
    this.session$.next(null);
  }

  private read(): StoredSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as StoredSession;
      if (!parsed?.user) {
        return null;
      }
      const role = parsed.role ?? normalizeUserRole(parsed.user);
      return { user: { ...parsed.user, role }, role };
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
