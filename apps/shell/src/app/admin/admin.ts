import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminApi, AdminUser } from '../core/admin.api';
import { AuthService } from '../core/auth.service';
import { PlanType } from '../core/auth.models';
import { PLAN_CATALOG } from '../core/plans.service';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage implements OnInit {
  private readonly api = inject(AdminApi);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(true);
  readonly savingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly forbidden = signal(false);

  readonly paidPlans = PLAN_CATALOG.filter((plan) => plan.type !== 'free_trial');

  readonly search = this.fb.nonNullable.group({
    q: [''],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.forbidden.set(false);
    this.api
      .listUsers(this.search.controls.q.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.users.set(rows),
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            this.forbidden.set(true);
            this.error.set('Admin access required.');
            return;
          }
          if (err instanceof HttpErrorResponse && err.status === 404) {
            this.error.set(
              'Admin API is not deployed yet. Apply tools/junctionback-admin to junctionBack.',
            );
            return;
          }
          this.error.set(this.readError(err, 'Could not load admin users.'));
        },
      });
  }

  assignPlan(user: AdminUser, planType: PlanType): void {
    if (planType === 'free_trial') {
      return;
    }
    this.savingId.set(user.id);
    this.error.set('');
    this.success.set('');
    this.api
      .setPlan(user.id, planType)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.users.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
          this.success.set(`${updated.display_name} is now on ${updated.plan.name}.`);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not update plan.')),
      });
  }

  activate(user: AdminUser, planType: PlanType): void {
    if (planType === 'free_trial') {
      return;
    }
    this.savingId.set(user.id);
    this.error.set('');
    this.success.set('');
    this.api
      .activate(user.id, planType)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.users.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
          this.success.set(`${updated.display_name} activated on ${updated.plan.name}.`);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not activate account.')),
      });
  }

  logout(): void {
    this.auth.logout();
  }

  goBackOffice(): void {
    void this.router.navigateByUrl('/back-office');
  }

  statusLabel(user: AdminUser): string {
    if (!user.plan.is_active || user.plan.status === 'expired') {
      return 'Disabled';
    }
    if (user.plan.type === 'free_trial') {
      return `Trial · ${user.plan.days_remaining ?? 0}d left`;
    }
    return user.plan.status;
  }

  private readError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const detail = error.error?.detail;
      if (typeof detail === 'string' && detail.trim()) {
        return detail;
      }
    }
    return fallback;
  }
}
