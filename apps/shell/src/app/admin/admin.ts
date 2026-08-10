import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import {
  AdminApi,
  AdminShopRow,
  AdminUserRecord,
  ReactivateUserResponse,
  Shop,
  ViewerRecord,
} from '../core/admin.api';
import { AuthService } from '../core/auth.service';
import { SessionService } from '../core/session.service';

export type AdminTab = 'workings' | 'add' | 'viewers';

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

  readonly tab = signal<AdminTab>('workings');
  readonly shops = signal<AdminShopRow[]>([]);
  readonly filtered = signal<AdminShopRow[]>([]);
  readonly viewers = signal<ViewerRecord[]>([]);
  readonly loading = signal(true);
  readonly viewersLoading = signal(false);
  readonly savingId = signal<string | null>(null);
  readonly creating = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly restoredActivities = signal<string[]>([]);
  readonly forbidden = signal(false);
  readonly menuOpen = signal(false);

  readonly adminId = this.session.user?.id ?? '';
  readonly adminName = this.session.user?.display_name ?? 'Admin';

  readonly search = this.fb.nonNullable.group({
    q: [''],
  });

  readonly createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(160)]],
    city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    locality: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
  });

  readonly shopCount = computed(() => this.shops().length);
  readonly activeCount = computed(() => this.shops().filter((shop) => shop.is_active).length);
  readonly productTotal = computed(() =>
    this.shops().reduce((sum, shop) => sum + (shop.products_count || 0), 0),
  );
  readonly viewerCount = computed(() => this.viewers().length);
  readonly deactivatedViewerCount = computed(
    () => this.viewers().filter((row) => row.account_status === 'deactivated').length,
  );

  ngOnInit(): void {
    this.reload();
  }

  setTab(tab: AdminTab): void {
    this.tab.set(tab);
    this.error.set('');
    this.success.set('');
    this.restoredActivities.set([]);
    this.menuOpen.set(false);
    if (tab === 'viewers') {
      this.reloadViewers();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
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
              'Shops API is not live yet. Deploy junctionBack shops + admin activate/reactivate.',
            );
            return;
          }
          this.error.set(this.readError(err, 'Could not load shops.'));
        },
      });
  }

  reloadViewers(): void {
    this.viewersLoading.set(true);
    this.error.set('');
    this.api
      .listViewers()
      .pipe(finalize(() => this.viewersLoading.set(false)))
      .subscribe({
        next: (rows) => this.viewers.set(rows),
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            this.forbidden.set(true);
            this.error.set('Admin access required.');
            return;
          }
          this.error.set(this.readError(err, 'Could not load viewers.'));
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

  createShop(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const raw = this.createForm.getRawValue();
    const payload = {
      name: raw.name.trim(),
      city: raw.city.trim(),
      locality: raw.locality.trim(),
    };
    this.creating.set(true);
    this.error.set('');
    this.success.set('');
    this.restoredActivities.set([]);
    this.api
      .createShop(payload)
      .pipe(finalize(() => this.creating.set(false)))
      .subscribe({
        next: (shop: Shop) => {
          this.success.set(`Shop “${shop.name}” created.`);
          this.createForm.reset({ name: '', city: '', locality: '' });
          this.setTab('workings');
          this.reload();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not create shop via POST /shops.')),
      });
  }

  /**
   * Shop Active checkbox — mirrors junctionBack:
   * - Off → POST /admin/users/{id}/deactivate (role becomes viewer)
   * - On + deactivated → POST /admin/users/{id}/reactivate (restores role/plan/activities)
   * - On otherwise → POST /admin/users/{id}/activate
   */
  onActiveChange(shop: AdminShopRow, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextActive = input.checked;
    this.savingId.set(shop.id);
    this.error.set('');
    this.success.set('');
    this.restoredActivities.set([]);

    if (!nextActive) {
      this.api
        .deactivateUser(shop.owner_user_id)
        .pipe(finalize(() => this.savingId.set(null)))
        .subscribe({
          next: (owner) => {
            this.patchShopOwner(shop.id, owner);
            this.success.set(
              `${shop.name} owner deactivated. They can still sign in as a viewer.`,
            );
          },
          error: (err: unknown) => {
            input.checked = shop.is_active;
            this.error.set(this.readError(err, 'Could not deactivate shop owner.'));
          },
        });
      return;
    }

    const request$: Observable<AdminUserRecord | ReactivateUserResponse> =
      shop.account_status === 'deactivated'
        ? this.api.reactivateUser(shop.owner_user_id)
        : this.api.activateUser(shop.owner_user_id);

    request$.pipe(finalize(() => this.savingId.set(null))).subscribe({
      next: (result) => {
        const owner = this.asUserRecord(result);
        this.patchShopOwner(shop.id, owner);
        if (this.isReactivateResponse(result)) {
          this.restoredActivities.set(result.restored_activities ?? []);
          this.success.set(
            `${shop.name} owner reactivated as ${result.restored_role}. Plan: ${result.restored_plan?.name ?? owner.plan_name}.`,
          );
        } else {
          this.success.set(`${shop.name} owner activated.`);
        }
      },
      error: (err: unknown) => {
        input.checked = shop.is_active;
        this.error.set(
          this.readError(
            err,
            shop.account_status === 'deactivated'
              ? 'Could not reactivate shop owner.'
              : 'Could not activate shop owner.',
          ),
        );
      },
    });
  }

  reactivateViewer(viewer: ViewerRecord): void {
    this.savingId.set(viewer.id);
    this.error.set('');
    this.success.set('');
    this.restoredActivities.set([]);

    const request$: Observable<AdminUserRecord | ReactivateUserResponse> =
      viewer.account_status === 'deactivated'
        ? this.api.reactivateUser(viewer.id)
        : this.api.activateUser(viewer.id);

    request$.pipe(finalize(() => this.savingId.set(null))).subscribe({
      next: (result) => {
        if (this.isReactivateResponse(result)) {
          this.restoredActivities.set(result.restored_activities ?? []);
          this.success.set(
            `${viewer.display_name || 'User'} reactivated as ${result.restored_role}. Plan: ${result.restored_plan?.name ?? '—'}.`,
          );
        } else {
          this.success.set(
            `${viewer.display_name || 'User'} activated as ${result.role}. Plan: ${result.plan_name}.`,
          );
        }
        this.reloadViewers();
        this.reload();
      },
      error: (err: unknown) => {
        this.error.set(
          this.readError(
            err,
            viewer.account_status === 'deactivated'
              ? 'Could not reactivate viewer.'
              : 'Could not activate viewer.',
          ),
        );
      },
    });
  }

  deactivateViewer(viewer: ViewerRecord): void {
    this.savingId.set(viewer.id);
    this.error.set('');
    this.success.set('');
    this.restoredActivities.set([]);
    this.api
      .deactivateUser(viewer.id)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: () => {
          this.success.set(
            `${viewer.display_name || 'User'} deactivated. Login remains available as viewer.`,
          );
          this.reloadViewers();
          this.reload();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not deactivate viewer.')),
      });
  }

  deleteViewer(viewer: ViewerRecord): void {
    this.savingId.set(viewer.id);
    this.error.set('');
    this.success.set('');
    this.restoredActivities.set([]);
    this.api
      .deleteViewers([viewer.id])
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: (result) => {
          if (result.protected_owner_ids?.length || result.protected_admin_ids?.length) {
            this.error.set('Owners and admins cannot be deleted — only viewer accounts.');
            return;
          }
          if (!result.deleted_count) {
            this.error.set('Viewer was not deleted.');
            return;
          }
          this.success.set(`${viewer.display_name || 'Viewer'} deleted.`);
          this.reloadViewers();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not delete viewer.')),
      });
  }

  activityLabel(slug: string): string {
    return slug
      .split('_')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  logout(): void {
    this.auth.logout();
  }

  goApp(): void {
    void this.router.navigateByUrl('/back-office');
  }

  private patchShopOwner(shopId: string, owner: AdminUserRecord): void {
    const isActive = owner.account_status === 'active';
    this.shops.update((rows) =>
      rows.map((row) =>
        row.id === shopId
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
  }

  private asUserRecord(result: AdminUserRecord | ReactivateUserResponse): AdminUserRecord {
    return this.isReactivateResponse(result) ? result.user : result;
  }

  private isReactivateResponse(
    result: AdminUserRecord | ReactivateUserResponse,
  ): result is ReactivateUserResponse {
    return !!result && typeof result === 'object' && 'restored_activities' in result;
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
