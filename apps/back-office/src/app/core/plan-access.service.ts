import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { PlanSummary } from './models';
import { PlansApi } from './plans.api';

const SESSION_KEY = 'junction.session';

@Injectable({ providedIn: 'root' })
export class PlanAccessService {
  private readonly plansApi = inject(PlansApi);

  readonly plan = signal<PlanSummary | null>(null);
  readonly loading = signal(true);
  /**
   * Locked = viewer / post-grace deactivated account.
   * After Premium (or trial) and grace end, the user is a viewer — not an owner.
   */
  readonly locked = signal(false);
  readonly isViewer = signal(false);

  refresh(): Observable<PlanSummary | null> {
    this.loading.set(true);
    return this.plansApi.me().pipe(
      catchError(() => of(null)),
      tap((plan) => {
        this.plan.set(plan);
        const viewer = this.readViewerRole();
        this.isViewer.set(viewer);
        this.locked.set(viewer || this.isPostGraceDeactivated(plan));
        this.loading.set(false);
      }),
    );
  }

  markUnlocked(plan: PlanSummary): void {
    this.plan.set(plan);
    this.promoteViewerToOwner();
    this.isViewer.set(false);
    this.locked.set(this.isPostGraceDeactivated(plan));
  }

  /** Premium/trial ended and grace finished — deactivated viewer state. */
  private isPostGraceDeactivated(plan: PlanSummary | null): boolean {
    if (!plan) {
      return false;
    }
    // Still in grace → remain an active owner experience.
    if (plan.in_grace_period || plan.status === 'grace_period') {
      return false;
    }
    return (
      plan.status === 'expired' ||
      plan.status === 'deactivated' ||
      plan.status === 'cancelled' ||
      plan.is_active === false
    );
  }

  private readViewerRole(): boolean {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as {
        role?: string;
      } | null;
      return parsed?.role === 'viewer';
    } catch {
      return false;
    }
  }

  /** After activating a plan, the account is an owner again (client session). */
  private promoteViewerToOwner(): void {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as { user?: Record<string, unknown>; role?: string };
      if (parsed.role !== 'viewer') {
        return;
      }
      const next = {
        ...parsed,
        role: 'owner',
        user: { ...(parsed.user ?? {}), role: 'owner' },
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
}
