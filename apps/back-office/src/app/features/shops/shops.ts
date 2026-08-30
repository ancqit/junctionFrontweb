import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from '../../core/current-shop.service';
import {
  DEFAULT_CLOSED_TIME,
  DEFAULT_OPEN_TIME,
  LocationsApi,
  normalizeShopTime,
  Shop,
  ShopsApi,
} from '../../core/shops.api';
import { SHOP_TYPE_OPTIONS, shopTypeLabel } from '../../core/shop-types.catalog';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';
import {
  LocationPickerModalComponent,
  LocationPickerOption,
} from '../../shared/location-picker-modal/location-picker-modal';

const LOCALITY_GEOCODE_ERROR =
  'Could not verify that locality. Enter a real or prominent locality name.';

type ActiveLocationPicker = 'city' | 'locality' | null;

const SHOP_TYPE_SELECT_OPTIONS: InlineSelectOption[] = [
  { value: '', label: 'Select type' },
  ...SHOP_TYPE_OPTIONS.map((row) => ({ value: row.value, label: row.label })),
];

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
  ],
  templateUrl: './shops.html',
  styleUrl: './shops.scss',
})
export class ShopsPage implements OnInit {
  private readonly shopsApi = inject(ShopsApi);
  private readonly locationsApi = inject(LocationsApi);
  private readonly currentShop = inject(CurrentShopService);
  private readonly fb = inject(FormBuilder);

  readonly shopTypeSelectOptions = SHOP_TYPE_SELECT_OPTIONS;
  readonly shops = signal<Shop[]>([]);
  readonly activeShopId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly showForm = signal(false);

  readonly cities = signal<string[]>([]);
  readonly localities = signal<string[]>([]);
  readonly localitiesLoading = signal(false);
  readonly activePicker = signal<ActiveLocationPicker>(null);
  readonly localityValidating = signal(false);
  readonly localityPickerError = signal<string | null>(null);

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
    this.locationsApi.cities().subscribe({
      next: (rows) => this.cities.set(rows),
      error: () => this.cities.set([]),
    });
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.currentShop
      .refresh()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (active) => {
          this.shops.set(this.currentShop.shops());
          this.activeShopId.set(active?.id ?? null);
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
}
