import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from '../../core/current-shop.service';
import { EmployeesApi } from '../../core/employees.api';
import { buildPlanCountdown, PlanCountdown } from '../../core/plan-countdown';
import { OrdersApi } from '../../core/orders.api';
import { PlansApi } from '../../core/plans.api';
import { ProductsApi } from '../../core/products.api';
import { ProfileApi } from '../../core/profile.api';
import { LocationsApi, Shop, ShopsApi } from '../../core/shops.api';
import { SHOP_TYPE_OPTIONS, shopTypeLabel } from '../../core/shop-types.catalog';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-overview',
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewPage implements OnInit {
  private readonly employeesApi = inject(EmployeesApi);
  private readonly productsApi = inject(ProductsApi);
  private readonly ordersApi = inject(OrdersApi);
  private readonly plansApi = inject(PlansApi);
  private readonly profileApi = inject(ProfileApi);
  private readonly shopsApi = inject(ShopsApi);
  private readonly locationsApi = inject(LocationsApi);
  private readonly currentShop = inject(CurrentShopService);
  private readonly fb = inject(FormBuilder);

  readonly shopTypeOptions = SHOP_TYPE_OPTIONS;
  readonly productCount = signal(0);
  readonly employeeCount = signal(0);
  readonly orderCount = signal(0);
  readonly loading = signal(true);
  readonly profile = signal<UserProfile | null>(null);
  readonly countdown = signal<PlanCountdown | null>(null);

  readonly shop = signal<Shop | null>(null);
  readonly shopType = signal<string | null>(null);
  readonly shopLoaded = signal(false);
  readonly editingShop = signal(false);
  readonly cities = signal<string[]>([]);
  readonly localities = signal<string[]>([]);
  readonly shopSaving = signal(false);
  readonly shopError = signal('');
  readonly shopSuccess = signal('');

  readonly shopForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    locality: ['', [Validators.required, Validators.minLength(2)]],
    shop_type: ['', [Validators.required]],
  });

  /** Local draft only — backend `POST /notices` wiring comes later. */
  readonly noticeForm = this.fb.nonNullable.group({
    message: ['', [Validators.maxLength(1000)]],
  });
  readonly noticeDraft = signal<string | null>(null);

  readonly greetingName = computed(() => this.profile()?.display_name?.trim() || 'there');
  readonly userId = computed(() => this.profile()?.id ?? '');
  readonly useCityDropdown = computed(() => this.cities().length > 0);
  readonly useLocalityDropdown = computed(() => this.localities().length > 0);
  readonly shopTypeLabelText = computed(() => shopTypeLabel(this.shopType()));

  /** Shop has been saved with name, place, and type. */
  readonly shopConfigured = computed(() => {
    const shop = this.shop();
    return (
      !!shop?.id &&
      !!shop.name?.trim() &&
      !!shop.city?.trim() &&
      !!shop.locality?.trim() &&
      !!this.shopType()?.trim()
    );
  });

  /**
   * Dashboard (metrics, notices, + New bill) shows when the shop is configured
   * and the user is not currently editing shop details.
   */
  readonly shopReady = computed(() => this.shopConfigured() && !this.editingShop());

  ngOnInit(): void {
    this.profileApi.me().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => this.profile.set(null),
    });
    this.loadShopForm();
  }

  onCityChange(): void {
    const city = this.shopForm.controls.city.value;
    this.shopForm.controls.locality.setValue('');
    this.loadLocalities(city);
  }

  openShopEditor(): void {
    const shop = this.shop();
    if (!shop) {
      return;
    }
    this.shopForm.patchValue({
      name: shop.name ?? '',
      city: shop.city ?? '',
      locality: shop.locality ?? '',
      shop_type: this.shopType() ?? '',
    });
    if (shop.city) {
      this.loadLocalities(shop.city, shop.locality ?? '');
    }
    this.shopError.set('');
    this.shopSuccess.set('');
    this.editingShop.set(true);
  }

  cancelShopEditor(): void {
    // Only leave the editor when the shop is already configured; otherwise stay on setup.
    if (this.shopConfigured()) {
      this.editingShop.set(false);
    }
    this.shopError.set('');
  }

  saveShop(): void {
    if (this.shopForm.invalid) {
      this.shopForm.markAllAsTouched();
      return;
    }
    const raw = this.shopForm.getRawValue();
    const payload = {
      name: raw.name.trim(),
      city: raw.city.trim(),
      locality: raw.locality.trim(),
    };
    const shopType = raw.shop_type.trim();
    if (!shopType) {
      this.shopForm.controls.shop_type.markAsTouched();
      this.shopError.set('Select a shop type before saving.');
      return;
    }

    this.shopSaving.set(true);
    this.shopError.set('');
    this.shopSuccess.set('');

    const existing = this.shop();
    const full$ = existing
      ? this.shopsApi.update(existing.id, payload)
      : this.shopsApi.create(payload);

    full$.subscribe({
      next: (shop) => {
        this.shopSaving.set(false);
        this.applySavedShop(shop, payload, shopType);
      },
      error: (err: unknown) => {
        // Older Render builds may only accept { name }. Persist name remotely,
        // keep city/locality/type on the client so Overview can unlock.
        if (!this.isUnprocessable(err)) {
          this.shopSaving.set(false);
          this.shopError.set(this.describeShopError(err));
          return;
        }
        const nameOnly$ = existing
          ? this.shopsApi.update(existing.id, { name: payload.name })
          : this.shopsApi.create({ name: payload.name });
        nameOnly$.pipe(finalize(() => this.shopSaving.set(false))).subscribe({
          next: (shop) => this.applySavedShop(shop, payload, shopType),
          error: (fallbackErr: unknown) => {
            this.shopError.set(this.describeShopError(fallbackErr));
          },
        });
      },
    });
  }

  /** After a successful create/update, unlock the dashboard with form values. */
  private applySavedShop(
    shop: Shop,
    payload: { name: string; city: string; locality: string },
    shopType: string,
  ): void {
    const existing = this.shop();
    const merged: Shop = {
      ...shop,
      id: shop.id || existing?.id || '',
      name: payload.name || shop.name,
      city: payload.city || shop.city || '',
      locality: payload.locality || shop.locality || '',
    };
    this.currentShop.writeShopType(merged.id, shopType);
    this.currentShop.writeShopPlace(merged.id, {
      city: merged.city,
      locality: merged.locality,
    });
    this.shopType.set(shopType);
    this.shop.set(merged);
    this.currentShop.setShop(merged);
    this.editingShop.set(false);
    this.shopSuccess.set('Shop details saved. Overview is ready.');
    this.loadDashboard();
  }

  private isUnprocessable(err: unknown): boolean {
    return (
      !!err &&
      typeof err === 'object' &&
      'status' in err &&
      (err as { status?: number }).status === 422
    );
  }

  private describeShopError(err: unknown): string {
    const detail = (err as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim()
      ? detail
      : 'Could not save shop details.';
  }

  todayLabel(): string {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }

  saveNoticeDraft(): void {
    const message = this.noticeForm.controls.message.value.trim();
    if (!message) {
      this.noticeForm.controls.message.markAsTouched();
      return;
    }
    this.noticeDraft.set(message);
  }

  clearNoticeDraft(): void {
    this.noticeForm.reset({ message: '' });
    this.noticeDraft.set(null);
  }

  private loadShopForm(): void {
    this.locationsApi.cities().subscribe({
      next: (cities) => this.cities.set(cities),
    });
    this.shopsApi.list().subscribe({
      next: (shops) => {
        // Overlay client-saved city/locality when the API response omits them.
        const shop = this.currentShop.applyPlaceOverlay(shops[0] ?? null);
        this.shop.set(shop);
        this.currentShop.setShop(shop);
        this.shopLoaded.set(true);
        if (shop) {
          const storedType = this.currentShop.readShopType(shop.id);
          this.shopType.set(storedType);
          this.shopForm.patchValue({
            name: shop.name ?? '',
            city: shop.city ?? '',
            locality: shop.locality ?? '',
            shop_type: storedType ?? '',
          });
          if (shop.city) {
            this.loadLocalities(shop.city, shop.locality ?? '');
          }
          // Incomplete shop (missing place or type) stays on the setup form.
          const complete =
            !!shop.name?.trim() &&
            !!shop.city?.trim() &&
            !!shop.locality?.trim() &&
            !!storedType;
          this.editingShop.set(!complete);
        } else {
          this.editingShop.set(false);
        }
        if (this.shopReady()) {
          this.loadDashboard();
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.shop.set(null);
        this.currentShop.setShop(null);
        this.shopLoaded.set(true);
        this.loading.set(false);
      },
    });
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.plansApi.me().subscribe({
      next: (plan) => this.countdown.set(buildPlanCountdown(plan)),
      error: () => this.countdown.set(null),
    });
    this.productsApi.list().subscribe({
      next: (products) => this.productCount.set(products.length),
      error: () => this.productCount.set(0),
    });
    this.employeesApi.list().subscribe({
      next: (employees) => this.employeeCount.set(employees.length),
      error: () => this.employeeCount.set(0),
    });
    this.ordersApi
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (orders) => this.orderCount.set(orders.length),
        error: () => undefined,
      });
  }

  private loadLocalities(city: string, keepLocality = ''): void {
    this.locationsApi.localities(city).subscribe({
      next: (rows) => {
        this.localities.set(rows);
        if (keepLocality) {
          this.shopForm.controls.locality.setValue(keepLocality);
        }
      },
    });
  }
}
