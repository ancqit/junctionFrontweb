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

  /**
   * Overview unlocks after a successful shop save (name/city/locality)
   * plus a selected shop type (catalog from junctionBack GET /shops/types).
   */
  readonly shopReady = computed(() => {
    const shop = this.shop();
    return (
      !!shop?.id &&
      !!shop.name?.trim() &&
      !!shop.city?.trim() &&
      !!shop.locality?.trim() &&
      !!this.shopType()?.trim() &&
      !this.editingShop()
    );
  });

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
    this.editingShop.set(false);
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
    this.shopSaving.set(true);
    this.shopError.set('');
    this.shopSuccess.set('');

    const existing = this.shop();
    const request$ = existing
      ? this.shopsApi.update(existing.id, payload)
      : this.shopsApi.create(payload);

    request$.pipe(finalize(() => this.shopSaving.set(false))).subscribe({
      next: (shop) => {
        this.currentShop.writeShopType(shop.id, shopType);
        this.shopType.set(shopType);
        this.shop.set(shop);
        this.currentShop.setShop(shop);
        this.editingShop.set(false);
        this.shopSuccess.set('Shop details saved.');
        this.loadDashboard();
      },
      error: (err: unknown) => {
        const detail = (err as { error?: { detail?: string } })?.error?.detail;
        this.shopError.set(
          typeof detail === 'string' && detail.trim() ? detail : 'Could not save shop details.',
        );
      },
    });
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
        const shop = shops[0] ?? null;
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
          if (!storedType) {
            this.editingShop.set(true);
          }
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
