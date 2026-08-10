import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminApi, AdminShopRow, WaitlistApplication } from '../core/admin.api';
import { AuthService } from '../core/auth.service';
import { SessionService } from '../core/session.service';

/** Two tabs only — shops overview + viewer waitlist approval. */
export type AdminTab = 'shops' | 'waitlist';

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

  readonly tab = signal<AdminTab>('shops');
  readonly shops = signal<AdminShopRow[]>([]);
  readonly filtered = signal<AdminShopRow[]>([]);
  readonly waitlist = signal<WaitlistApplication[]>([]);
  readonly loading = signal(true);
  readonly waitlistLoading = signal(false);
  readonly approvingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly forbidden = signal(false);
  readonly menuOpen = signal(false);

  readonly adminId = this.session.user?.id ?? '';
  readonly adminName = this.session.user?.display_name ?? 'Admin';

  readonly search = this.fb.nonNullable.group({
    q: [''],
  });

  readonly shopCount = computed(() => this.shops().length);
  readonly productTotal = computed(() =>
    this.shops().reduce((sum, shop) => sum + (shop.products_count || 0), 0),
  );
  readonly pendingWaitlist = computed(() =>
    this.waitlist().filter((row) => String(row.status).toLowerCase() === 'pending'),
  );
  readonly pendingCount = computed(() => this.pendingWaitlist().length);
  readonly waitlistTotal = computed(() => this.waitlist().length);

  ngOnInit(): void {
    this.reloadShops();
    // Prefetch waitlist so the tab badge shows pending count.
    this.reloadWaitlist();
  }

  setTab(tab: AdminTab): void {
    this.tab.set(tab);
    this.error.set('');
    this.success.set('');
    this.menuOpen.set(false);
    if (tab === 'waitlist') {
      this.reloadWaitlist();
    } else {
      this.reloadShops();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  reload(): void {
    if (this.tab() === 'waitlist') {
      this.reloadWaitlist();
    } else {
      this.reloadShops();
    }
  }

  reloadShops(): void {
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
          this.error.set(this.readError(err, 'Could not load shops.'));
        },
      });
  }

  reloadWaitlist(): void {
    this.waitlistLoading.set(true);
    this.error.set('');
    this.forbidden.set(false);
    this.api
      .listWaitlist()
      .pipe(finalize(() => this.waitlistLoading.set(false)))
      .subscribe({
        next: (rows) => this.waitlist.set(rows),
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            this.forbidden.set(true);
            this.error.set('Admin access required.');
            return;
          }
          this.error.set(this.readError(err, 'Could not load waitlist.'));
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
        [shop.name, shop.phone_number, shop.owner_name, shop.city, shop.locality, shop.owner_user_id]
          .join(' ')
          .toLowerCase()
          .includes(q),
      ),
    );
  }

  /**
   * Approve a pending waitlist viewer —
   * junctionBack `POST /admin/users/{user_id}/activate`.
   * Owners choose plans themselves via `POST /plans/select`.
   */
  approveWaitlist(entry: WaitlistApplication): void {
    if (String(entry.status).toLowerCase() !== 'pending') {
      this.error.set('Only pending waitlist applications can be approved.');
      return;
    }
    this.approvingId.set(entry.id);
    this.error.set('');
    this.success.set('');
    this.api
      .approveWaitlistUser(entry.user_id)
      .pipe(finalize(() => this.approvingId.set(null)))
      .subscribe({
        next: (user) => {
          this.success.set(
            `Approved ${entry.identity.display_name || 'viewer'} → ${user.role} on ${user.plan_name}.`,
          );
          this.reloadWaitlist();
          this.reloadShops();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not approve waitlist application.')),
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
