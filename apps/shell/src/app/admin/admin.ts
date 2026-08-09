import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminApi, AdminShop } from '../core/admin.api';
import { AuthService } from '../core/auth.service';
import { SessionService } from '../core/session.service';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage implements OnInit {
  private readonly api = inject(AdminApi);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly shops = signal<AdminShop[]>([]);
  readonly loading = signal(true);
  readonly savingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly forbidden = signal(false);

  /** Login ID from OTP / refresh — used for admin session identity. */
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
      .listShops(this.search.controls.q.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.shops.set(rows),
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            this.forbidden.set(true);
            this.error.set('Admin access required.');
            return;
          }
          if (err instanceof HttpErrorResponse && err.status === 404) {
            this.error.set(
              'Admin shops API is not deployed yet. Apply tools/junctionback-admin to junctionBack.',
            );
            return;
          }
          this.error.set(this.readError(err, 'Could not load shops.'));
        },
      });
  }

  onActiveChange(shop: AdminShop, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextActive = input.checked;
    this.savingId.set(shop.id);
    this.error.set('');
    this.success.set('');

    this.api
      .setShopActive(shop.id, nextActive)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.shops.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
          this.success.set(
            updated.is_active
              ? `${updated.name} activated.`
              : `${updated.name} deactivated.`,
          );
        },
        error: (err: unknown) => {
          input.checked = shop.is_active;
          this.error.set(
            this.readError(
              err,
              nextActive ? 'Could not activate shop.' : 'Could not deactivate shop.',
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
