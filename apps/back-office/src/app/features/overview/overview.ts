import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EmployeesApi } from '../../core/employees.api';
import { buildPlanCountdown, PlanCountdown } from '../../core/plan-countdown';
import { OrdersApi } from '../../core/orders.api';
import { PlansApi } from '../../core/plans.api';
import { ProductsApi } from '../../core/products.api';
import { ProfileApi } from '../../core/profile.api';
import { LocationsApi, Shop, ShopsApi } from '../../core/shops.api';
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
  private readonly fb = inject(FormBuilder);

  readonly productCount = signal(0);
  readonly employeeCount = signal(0);
  readonly orderCount = signal(0);
  readonly loading = signal(true);
  readonly profile = signal<UserProfile | null>(null);
  readonly countdown = signal<PlanCountdown | null>(null);

  readonly shop = signal<Shop | null>(null);
  readonly cities = signal<string[]>([]);
  readonly localities = signal<string[]>([]);
  readonly shopSaving = signal(false);
  readonly shopError = signal('');
  readonly shopSuccess = signal('');

  readonly shopForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    locality: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly greetingName = computed(() => this.profile()?.display_name?.trim() || 'there');
  readonly userId = computed(() => this.profile()?.id ?? '');
  readonly useCityDropdown = computed(() => this.cities().length > 0);
  readonly useLocalityDropdown = computed(() => this.localities().length > 0);

  ngOnInit(): void {
    this.profileApi.me().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => this.profile.set(null),
    });
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

    this.loadShopForm();
  }

  onCityChange(): void {
    const city = this.shopForm.controls.city.value;
    this.shopForm.controls.locality.setValue('');
    this.loadLocalities(city);
  }

  saveShop(): void {
    if (this.shopForm.invalid) {
      this.shopForm.markAllAsTouched();
      return;
    }
    const payload = {
      name: this.shopForm.controls.name.value.trim(),
      city: this.shopForm.controls.city.value.trim(),
      locality: this.shopForm.controls.locality.value.trim(),
    };
    this.shopSaving.set(true);
    this.shopError.set('');
    this.shopSuccess.set('');

    const existing = this.shop();
    const request$ = existing
      ? this.shopsApi.update(existing.id, payload)
      : this.shopsApi.create(payload);

    request$.pipe(finalize(() => this.shopSaving.set(false))).subscribe({
      next: (shop) => {
        this.shop.set(shop);
        this.shopSuccess.set('Shop details saved.');
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

  private loadShopForm(): void {
    this.locationsApi.cities().subscribe({
      next: (cities) => this.cities.set(cities),
    });
    this.shopsApi.list().subscribe({
      next: (shops) => {
        const shop = shops[0] ?? null;
        this.shop.set(shop);
        if (shop) {
          this.shopForm.patchValue({
            name: shop.name ?? '',
            city: shop.city ?? '',
            locality: shop.locality ?? '',
          });
          if (shop.city) {
            this.loadLocalities(shop.city, shop.locality ?? '');
          }
        }
      },
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
