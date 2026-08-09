import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminApi, AdminShopRow } from '../core/admin.api';
import { AuthService } from '../core/auth.service';
import { SessionService } from '../core/session.service';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage implements OnInit {
  private readonly api = inject(AdminApi);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly shops = signal<AdminShopRow[]>([]);
  readonly filtered = signal<AdminShopRow[]>([]);
  readonly loading = signal(true);
  readonly savingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly forbidden = signal(false);

  readonly adminId = this.session.user?.id ?? '';
  readonly adminName = this.session.user?.display_name ?? 'Admin';

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
      .listShopRows()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => {
          this.shops.set(rows);
          this.applyFilter();
        },
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            this.forbidden.set(true);
            this.error.set('Admin access required.');
            return;
          }
          if (err instanceof HttpErrorResponse && err.status === 404) {
            this.error.set(
              'Shops API is not live yet. Merge junctionBack PR #10 (shops + admin activate/deactivate).',
            );
            return;
          }
          this.error.set(this.readError(err, 'Could not load shops.'));
        },
      });
  }

  applyFilter(): void {
    const q = this.search.controls.q.value.trim().toLowerCase();
    if (!q) {
      this.filtered.set(this.shops());
      return;
    }
    this.filtered.set(
      this.shops().filter((shop) =>
        [shop.name, shop.phone_number, shop.owner_name, shop.owner_user_id]
          .join(' ')
          .toLowerCase()
          .includes(q),
      ),
    );
  }

  onActiveChange(shop: AdminShopRow, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextActive = input.checked;
    this.savingId.set(shop.id);
    this.error.set('');
    this.success.set('');

    const request$ = nextActive
      ? this.api.activateUser(shop.owner_user_id)
      : this.api.deactivateUser(shop.owner_user_id);

    request$.pipe(finalize(() => this.savingId.set(null))).subscribe({
      next: (owner) => {
        const isActive = owner.account_status === 'active';
        this.shops.update((rows) =>
          rows.map((row) =>
            row.id === shop.id
              ? {
                  ...row,
                  account_status: owner.account_status,
                  plan_name: owner.plan_name,
                  plan_is_active: owner.plan_is_active,
                  owner_name: owner.display_name || row.owner_name,
                  owner_role: String(owner.role),
                  is_active: isActive,
                }
              : row,
          ),
        );
        this.applyFilter();
        this.success.set(
          isActive
            ? `${shop.name} owner activated.`
            : `${shop.name} owner deactivated.`,
        );
      },
      error: (err: unknown) => {
        input.checked = shop.is_active;
        this.error.set(
          this.readError(
            err,
            nextActive ? 'Could not activate shop owner.' : 'Could not deactivate shop owner.',
          ),
        );
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }

  goApp(): void {
    void this.router.navigateByUrl('/back-office');
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
