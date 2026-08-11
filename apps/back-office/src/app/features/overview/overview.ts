import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from '../../core/current-shop.service';
import { EmployeesApi } from '../../core/employees.api';
import { buildPlanCountdown, PlanCountdown } from '../../core/plan-countdown';
import { NoticesApi } from '../../core/notices.api';
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
  private readonly noticesApi = inject(NoticesApi);
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

  readonly shopOpen = signal(false);
  readonly hoursSaving = signal(false);
  readonly hoursSuccess = signal('');
  readonly hoursError = signal('');

  readonly noticeLoading = signal(false);
  readonly noticeSaving = signal(false);
  readonly noticeError = signal('');
  readonly noticeSuccess = signal('');

  readonly shopForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    locality: ['', [Validators.required, Validators.minLength(2)]],
    shop_type: ['', [Validators.required]],
  });

  readonly hoursForm = this.fb.nonNullable.group({
    opening_time: ['09:00', [Validators.required]],
    closing_time: ['21:00', [Validators.required]],
  });

  readonly noticeForm = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  readonly greetingName = computed(() => this.profile()?.display_name?.trim() || 'there');
  readonly userId = computed(() => this.profile()?.id ?? '');
  readonly useCityDropdown = computed(() => this.cities().length > 0);
  readonly useLocalityDropdown = computed(() => this.localities().length > 0);
  readonly shopTypeLabelText = computed(() => shopTypeLabel(this.shopType()));
  readonly shopStatusLabel = computed(() => (this.shopOpen() ? 'Open now' : 'Closed'));

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

  toggleShopOpen(): void {
    const shop = this.shop();
    if (!shop?.id) {
      return;
    }
    const next = !this.shopOpen();
    this.shopOpen.set(next);
    this.persistShopHours(shop.id);
  }

  saveShopHours(): void {
    const shop = this.shop();
    if (!shop?.id) {
      return;
    }
    if (this.hoursForm.invalid) {
      this.hoursForm.markAllAsTouched();
      return;
    }
    this.hoursSaving.set(true);
    this.hoursError.set('');
    this.hoursSuccess.set('');
    this.persistShopHours(shop.id);
    this.hoursSaving.set(false);
    this.hoursSuccess.set('Opening hours saved.');
  }

  saveNotice(): void {
    const shop = this.shop();
    if (!shop?.id) {
      return;
    }
    const message = this.noticeForm.controls.message.value.trim();
    if (!message) {
      this.noticeForm.controls.message.markAsTouched();
      return;
    }

    this.noticeSaving.set(true);
    this.noticeError.set('');
    this.noticeSuccess.set('');

    this.noticesApi
      .postToday({ store_id: shop.id, message })
      .pipe(finalize(() => this.noticeSaving.set(false)))
      .subscribe({
        next: () => {
          this.noticeSuccess.set('Today’s notice posted.');
        },
        error: (err: unknown) => {
          this.noticeError.set(this.describeApiError(err, 'Could not post notice.'));
        },
      });
  }

  clearNotice(): void {
    this.noticeForm.reset({ message: '' });
    this.noticeError.set('');
    this.noticeSuccess.set('');
  }

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
    this.loadShopHours(merged.id);
    this.loadDashboard();
  }

  private persistShopHours(shopId: string): void {
    const raw = this.hoursForm.getRawValue();
    this.currentShop.writeShopHours(shopId, {
      opening_time: raw.opening_time,
      closing_time: raw.closing_time,
      is_open: this.shopOpen(),
    });
  }

  private loadShopHours(shopId: string): void {
    const hours = this.currentShop.readShopHours(shopId);
    this.hoursForm.patchValue({
      opening_time: hours.opening_time,
      closing_time: hours.closing_time,
    });
    this.shopOpen.set(hours.is_open);
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
    return this.describeApiError(err, 'Could not save shop details.');
  }

  private describeApiError(err: unknown, fallback: string): string {
    const detail = (err as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }

  todayLabel(): string {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }

  private loadShopForm(): void {
    this.locationsApi.cities().subscribe({
      next: (cities) => this.cities.set(cities),
    });
    this.shopsApi.list().subscribe({
      next: (shops) => {
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
          this.loadShopHours(shop.id);
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
    this.loadTodayNotice();
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

  private loadTodayNotice(): void {
    const shop = this.shop();
    if (!shop?.id) {
      return;
    }
    this.noticeLoading.set(true);
    this.noticesApi
      .getToday(shop.id)
      .pipe(finalize(() => this.noticeLoading.set(false)))
      .subscribe({
        next: (notice) => {
          this.noticeForm.patchValue({ message: notice?.message ?? '' });
        },
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
