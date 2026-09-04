import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from '../../core/current-shop.service';
import { I18nService } from '../../core/i18n/i18n.service';
import {
  DEFAULT_CLOSED_TIME,
  DEFAULT_OPEN_TIME,
  LocationsApi,
  normalizeShopTime,
  Shop,
  ShopsApi,
} from '../../core/shops.api';
import { ShopLockService } from '../../core/shop-lock.service';
import { SHOP_TYPE_OPTIONS, shopTypeLabel } from '../../core/shop-types.catalog';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';
import {
  LocationPickerModalComponent,
  LocationPickerOption,
} from '../../shared/location-picker-modal/location-picker-modal';
import { normalizeSelectValue } from '../../shared/normalize-select-value';

const LOCALITY_GEOCODE_ERROR =
  'Could not verify that locality. Enter a real or prominent locality name.';
const OWNER_TOGGLE_COUNTDOWN_SEC = 3;
const OWNER_TOGGLE_COOLDOWN_MS = 10_000;

type ActiveLocationPicker = 'city' | 'locality' | null;

function fallbackShopTypeOptions(): InlineSelectOption[] {
  return SHOP_TYPE_OPTIONS.map((row) => ({
    value: row.value,
    label: row.label,
    hint: row.description,
  }));
}

/**
 * Shops = projects for a phone/user.
 * Create, open (select active), delete. Open/active shop scopes the rest of back-office.
 */
@Component({
  selector: 'app-shops',
  imports: [
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    InlineSelectComponent,
    LocationPickerModalComponent,
    TranslatePipe,
  ],
  templateUrl: './shops.html',
  styleUrl: './shops.scss',
})
export class ShopsPage implements OnInit, OnDestroy {
  private readonly shopsApi = inject(ShopsApi);
  private readonly locationsApi = inject(LocationsApi);
  private readonly currentShop = inject(CurrentShopService);
  private readonly shopLock = inject(ShopLockService);
  private readonly i18n = inject(I18nService);
  private readonly fb = inject(FormBuilder);

  readonly shopTypeSelectOptions = signal<InlineSelectOption[]>(fallbackShopTypeOptions());
  readonly shops = signal<Shop[]>([]);
  readonly activeShopId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly showForm = signal(false);
  readonly toggleBusyId = signal<string | null>(null);
  readonly toggleError = signal('');

  /** Owner↔viewer countdown (3…2…1) before applying lock. */
  readonly countdownShopId = signal<string | null>(null);
  readonly countdownSeconds = signal(0);
  readonly countdownTargetLocked = signal<boolean | null>(null);
  /** shopId → epoch ms when cooldown ends */
  readonly cooldownUntil = signal<Record<string, number>>({});
  /** Tick so cooldown remaining text updates. */
  readonly cooldownTick = signal(0);

  readonly cities = signal<string[]>([]);
  readonly localities = signal<string[]>([]);
  readonly localitiesLoading = signal(false);
  readonly activePicker = signal<ActiveLocationPicker>(null);
  readonly localityValidating = signal(false);
  readonly localityPickerError = signal<string | null>(null);

  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;
  private pendingCountdownShop: Shop | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    locality: ['', [Validators.required, Validators.minLength(2)]],
    address: [''],
    shop_type: ['', [Validators.required]],
    open_time: [DEFAULT_OPEN_TIME, [Validators.required]],
    closed_time: [DEFAULT_CLOSED_TIME, [Validators.required]],
  });

  readonly cityPickerOptions = computed<LocationPickerOption[]>(() =>
    this.cities().map((city) => ({ id: city.toLowerCase(), label: city })),
  );
  readonly localityPickerOptions = computed<LocationPickerOption[]>(() =>
    this.localities().map((locality) => ({ id: locality.toLowerCase(), label: locality })),
  );

  ngOnInit(): void {
    this.reload();
    this.shopsApi.listTypes().subscribe({
      next: (rows) => {
        if (!rows.length) {
          return;
        }
        const options = rows.map((row) => ({
          value: row.value,
          label: row.label,
          hint: row.description,
        }));
        this.shopTypeSelectOptions.set(options);
        const current = this.form.controls.shop_type.value;
        const normalized = normalizeSelectValue(current, options);
        if (normalized && normalized !== current) {
          this.form.controls.shop_type.setValue(normalized);
        }
      },
    });
    this.locationsApi.cities().subscribe({
      next: (rows) => this.cities.set(rows),
      error: () => this.cities.set([]),
    });
  }

  ngOnDestroy(): void {
    this.clearCountdownTimer();
    this.clearCooldownTimer();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.currentShop
      .refresh()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (active) => {
          const rows = this.currentShop.shops().map((shop) => this.shopLock.applyLockFromRecord(shop));
          this.shops.set(rows);
          this.activeShopId.set(active?.id ?? null);
          rows.forEach((shop) => {
            this.shopLock.ensurePlanExpiredLock(shop).subscribe({
              next: (updated) => {
                if (updated) {
                  this.patchShop(updated);
                }
              },
            });
          });
        },
        error: () => {
          this.shops.set([]);
          this.activeShopId.set(null);
          this.error.set('Could not load your shops.');
        },
      });
  }

  openForm(): void {
    this.showForm.set(true);
    this.error.set('');
    this.success.set('');
    this.form.reset({
      name: '',
      city: '',
      locality: '',
      address: '',
      shop_type: '',
      open_time: DEFAULT_OPEN_TIME,
      closed_time: DEFAULT_CLOSED_TIME,
    });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.closeLocationPicker();
  }

  selectShop(shop: Shop): void {
    this.error.set('');
    this.currentShop.selectShop(shop.id).subscribe({
      next: () => {
        this.activeShopId.set(shop.id);
        this.shopLock.syncActiveShopPlanLock().subscribe();
        this.success.set(`Active shop · ${shop.name}`);
      },
      error: () => this.error.set('Could not switch shop.'),
    });
  }

  removeShop(shop: Shop): void {
    if (!confirm(`Delete shop “${shop.name}”? This permanently removes the shop profile, products, employees, and orders for this shop.`)) {
      return;
    }
    this.deletingId.set(shop.id);
    this.error.set('');
    this.shopsApi.remove(shop.id).subscribe({
      next: () => {
        if (this.activeShopId() === shop.id) {
          this.currentShop.clearActiveShopId();
        }
        this.currentShop.clearShopOverlays(shop.id);
        this.deletingId.set(null);
        this.success.set(`Deleted ${shop.name}`);
        this.reload();
      },
      error: (err: unknown) => {
        this.deletingId.set(null);
        this.error.set(this.readError(err, 'Could not delete shop.'));
      },
    });
  }

  createShop(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name.trim(),
      city: raw.city.trim(),
      locality: raw.locality.trim(),
      address: raw.address.trim() || null,
      open_time: normalizeShopTime(raw.open_time) ?? DEFAULT_OPEN_TIME,
      closed_time: normalizeShopTime(raw.closed_time) ?? DEFAULT_CLOSED_TIME,
      is_open: true,
    };
    const shopType = raw.shop_type.trim();
    this.saving.set(true);
    this.error.set('');
    this.shopsApi
      .create(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (shop) => {
          this.currentShop.writeShopType(shop.id, shopType);
          this.currentShop.writeShopPlace(shop.id, {
            city: payload.city,
            locality: payload.locality,
          });
          this.currentShop.setShop(shop);
          this.shops.set(this.currentShop.shops());
          this.activeShopId.set(shop.id);
          this.showForm.set(false);
          this.success.set(`Created ${shop.name} · now active`);
          this.reload();
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not create shop.')),
      });
  }

  planLabel(shop: Shop): string {
    return shop.plan?.name?.trim() || 'Free Trial';
  }

  typeLabel(shop: Shop): string {
    return shopTypeLabel(this.currentShop.readShopType(shop.id)) || 'Shop';
  }

  isActive(shop: Shop): boolean {
    return this.activeShopId() === shop.id;
  }

  shopOpen(shop: Shop): boolean {
    return shop.is_open !== false;
  }

  phoneVisible(shop: Shop): boolean {
    if (shop.show_phone === true) {
      return true;
    }
    if (shop.show_phone === false) {
      return false;
    }
    return this.currentShop.readPhoneVisible(shop.id);
  }

  hasPhone(shop: Shop): boolean {
    return Boolean(shop.phone_number?.trim());
  }

  isOwnerMode(shop: Shop): boolean {
    return this.shopLock.isOwnerMode(shop);
  }

  ownerStatusLabel(shop: Shop): string {
    return this.isOwnerMode(shop) ? this.i18n.t('shops.ownerMode') : this.i18n.t('shops.viewerMode');
  }

  lockToggleDisabled(shop: Shop): boolean {
    return (
      this.toggleBusyId() === shop.id ||
      this.countdownShopId() === shop.id ||
      this.isInCooldown(shop.id) ||
      !this.shopLock.canManualUnlock(shop)
    );
  }

  isInCooldown(shopId: string): boolean {
    this.cooldownTick();
    const until = this.cooldownUntil()[shopId] ?? 0;
    return until > Date.now();
  }

  cooldownSecondsLeft(shopId: string): number {
    this.cooldownTick();
    const until = this.cooldownUntil()[shopId] ?? 0;
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  }

  toggleShopOpen(shop: Shop): void {
    if (!shop.id || !shop.name?.trim()) {
      return;
    }
    const next = !this.shopOpen(shop);
    this.patchShop({ ...shop, is_open: next });
    this.toggleBusyId.set(shop.id);
    this.toggleError.set('');
    this.shopsApi.updateOpenStatus({ name: shop.name.trim(), is_open: next }).subscribe({
      next: (updated) => {
        this.patchShop(updated);
        this.toggleBusyId.set(null);
      },
      error: (err: unknown) => {
        if (this.isUnprocessable(err)) {
          this.shopsApi.update(shop.id, { is_open: next }).subscribe({
            next: (updated) => {
              this.patchShop(updated);
              this.toggleBusyId.set(null);
            },
            error: (fallbackErr: unknown) => {
              this.patchShop({ ...shop, is_open: !next });
              this.toggleBusyId.set(null);
              this.toggleError.set(this.readError(fallbackErr, 'Could not update shop status.'));
            },
          });
          return;
        }
        this.patchShop({ ...shop, is_open: !next });
        this.toggleBusyId.set(null);
        this.toggleError.set(this.readError(err, 'Could not update shop status.'));
      },
    });
  }

  togglePhoneVisible(shop: Shop): void {
    if (!shop.id || !shop.name?.trim() || !this.hasPhone(shop)) {
      return;
    }
    const next = !this.phoneVisible(shop);
    this.patchShop({ ...shop, show_phone: next });
    this.currentShop.writePhoneVisible(shop.id, next);
    this.toggleBusyId.set(shop.id);
    this.toggleError.set('');
    this.shopsApi.updatePhoneStatus({ name: shop.name.trim(), show_phone: next }).subscribe({
      next: (updated) => {
        this.patchShop(updated);
        this.currentShop.writePhoneVisible(shop.id, updated.show_phone === true);
        this.toggleBusyId.set(null);
      },
      error: (err: unknown) => {
        if (this.isUnprocessable(err)) {
          this.shopsApi.update(shop.id, { show_phone: next }).subscribe({
            next: (updated) => {
              this.patchShop(updated);
              this.currentShop.writePhoneVisible(shop.id, next);
              this.toggleBusyId.set(null);
            },
            error: (fallbackErr: unknown) => {
              this.patchShop({ ...shop, show_phone: !next });
              this.currentShop.writePhoneVisible(shop.id, !next);
              this.toggleBusyId.set(null);
              this.toggleError.set(this.readError(fallbackErr, 'Could not update phone visibility.'));
            },
          });
          return;
        }
        this.patchShop({ ...shop, show_phone: !next });
        this.currentShop.writePhoneVisible(shop.id, !next);
        this.toggleBusyId.set(null);
        this.toggleError.set(this.readError(err, 'Could not update phone visibility.'));
      },
    });
  }

  /**
   * Owner↔viewer: prevent immediate flip. Show 3…2…1 countdown, then apply lock.
   * Checkbox click is cancelled so UI stays on current mode until countdown finishes.
   */
  onOwnerToggleClick(event: Event, shop: Shop): void {
    event.preventDefault();
    event.stopPropagation();
    this.beginOwnerToggle(shop);
  }

  beginOwnerToggle(shop: Shop): void {
    if (!shop.id || this.lockToggleDisabled(shop)) {
      if (shop.id && this.isInCooldown(shop.id)) {
        this.toggleError.set(this.i18n.t('shops.toggleCooldown'));
      }
      return;
    }
    if (this.countdownShopId()) {
      return;
    }

    const nextLocked = this.isOwnerMode(shop);
    this.pendingCountdownShop = shop;
    this.countdownShopId.set(shop.id);
    this.countdownTargetLocked.set(nextLocked);
    this.countdownSeconds.set(OWNER_TOGGLE_COUNTDOWN_SEC);
    this.toggleError.set('');
    this.clearCountdownTimer();
    this.countdownTimer = setInterval(() => {
      const next = this.countdownSeconds() - 1;
      if (next <= 0) {
        this.clearCountdownTimer();
        const target = this.pendingCountdownShop;
        const locked = this.countdownTargetLocked();
        this.countdownShopId.set(null);
        this.countdownSeconds.set(0);
        this.countdownTargetLocked.set(null);
        this.pendingCountdownShop = null;
        if (target && locked != null) {
          this.applyOwnerLock(target, locked);
        }
        return;
      }
      this.countdownSeconds.set(next);
    }, 1000);
  }

  cancelOwnerCountdown(): void {
    this.clearCountdownTimer();
    this.countdownShopId.set(null);
    this.countdownSeconds.set(0);
    this.countdownTargetLocked.set(null);
    this.pendingCountdownShop = null;
  }

  private applyOwnerLock(shop: Shop, nextLocked: boolean): void {
    this.toggleBusyId.set(shop.id);
    this.toggleError.set('');
    this.shopLock.setManualLock(shop, nextLocked).subscribe({
      next: (updated) => {
        this.patchShop(updated);
        this.toggleBusyId.set(null);
        if (this.isActive(updated)) {
          this.currentShop.setShop(updated);
        }
        this.startCooldown(shop.id);
      },
      error: (err: unknown) => {
        this.toggleBusyId.set(null);
        this.toggleError.set(this.readError(err, 'Could not update shop access.'));
      },
    });
  }

  private startCooldown(shopId: string): void {
    const until = Date.now() + OWNER_TOGGLE_COOLDOWN_MS;
    this.cooldownUntil.update((map) => ({ ...map, [shopId]: until }));
    this.ensureCooldownTicker();
  }

  private ensureCooldownTicker(): void {
    if (this.cooldownTimer) {
      return;
    }
    this.cooldownTimer = setInterval(() => {
      this.cooldownTick.update((n) => n + 1);
      const now = Date.now();
      const map = this.cooldownUntil();
      const stillActive = Object.values(map).some((until) => until > now);
      if (!stillActive) {
        this.clearCooldownTimer();
      }
    }, 500);
  }

  private clearCountdownTimer(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private clearCooldownTimer(): void {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  openCityPicker(): void {
    this.localityPickerError.set(null);
    this.activePicker.set('city');
  }

  openLocalityPicker(): void {
    if (!this.form.controls.city.value.trim() || this.localitiesLoading()) {
      return;
    }
    this.localityPickerError.set(null);
    this.activePicker.set('locality');
  }

  closeLocationPicker(): void {
    this.activePicker.set(null);
    this.localityPickerError.set(null);
    this.localityValidating.set(false);
  }

  clearLocalityPickerError(): void {
    this.localityPickerError.set(null);
  }

  onCityPicked(cityName: string): void {
    const trimmed = cityName.trim();
    if (!trimmed) {
      return;
    }
    const known = this.cities().find((city) => city.toLowerCase() === trimmed.toLowerCase());
    const city = known ?? trimmed;
    if (!known) {
      this.cities.update((rows) => (rows.includes(city) ? rows : [...rows, city].sort()));
    }
    this.form.controls.city.setValue(city);
    this.form.controls.locality.setValue('');
    this.localities.set([]);
    this.closeLocationPicker();
    this.loadLocalities(city);
  }

  onLocalityPicked(localityName: string): void {
    const city = this.form.controls.city.value.trim();
    const trimmed = localityName.trim();
    if (!city || !trimmed) {
      return;
    }
    const known = this.localities().find((row) => row.toLowerCase() === trimmed.toLowerCase());
    if (known) {
      this.form.controls.locality.setValue(known);
      this.closeLocationPicker();
      return;
    }
    this.localityValidating.set(true);
    this.localityPickerError.set(null);
    this.locationsApi.addJunction(city, trimmed).subscribe({
      next: (result) => {
        this.localityValidating.set(false);
        const locality = result.locality?.trim() || trimmed;
        this.localities.update((rows) =>
          rows.some((row) => row.toLowerCase() === locality.toLowerCase())
            ? rows
            : [...rows, locality].sort(),
        );
        this.form.controls.locality.setValue(locality);
        if (result.city?.trim() && result.city.trim() !== city) {
          this.form.controls.city.setValue(result.city.trim());
        }
        this.closeLocationPicker();
      },
      error: () => {
        this.localityValidating.set(false);
        this.localityPickerError.set(LOCALITY_GEOCODE_ERROR);
      },
    });
  }

  private loadLocalities(city: string): void {
    this.localitiesLoading.set(true);
    this.locationsApi.localities(city).subscribe({
      next: (rows) => {
        this.localities.set(rows);
        this.localitiesLoading.set(false);
      },
      error: () => {
        this.localities.set([]);
        this.localitiesLoading.set(false);
      },
    });
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }

  private patchShop(shop: Shop): void {
    const merged = this.shopLock.applyLockFromRecord(shop);
    this.shops.update((rows) => rows.map((row) => (row.id === merged.id ? merged : row)));
    if (this.isActive(merged)) {
      this.currentShop.setShop(merged);
    }
  }

  private isUnprocessable(err: unknown): boolean {
    const status = (err as { status?: number })?.status;
    return status === 404 || status === 405 || status === 422;
  }
}
