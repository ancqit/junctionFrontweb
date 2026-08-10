import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from '../../core/current-shop.service';
import { OrderLineItem, PaymentMethod, Product } from '../../core/models';
import { OrdersApi } from '../../core/orders.api';
import { ProductsApi } from '../../core/products.api';

interface BillLine {
  product: Product;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

@Component({
  selector: 'app-billing',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class BillingPage implements OnInit {
  private readonly productsApi = inject(ProductsApi);
  private readonly ordersApi = inject(OrdersApi);
  private readonly currentShop = inject(CurrentShopService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly catalog = signal<Product[]>([]);
  readonly lines = signal<BillLine[]>([]);
  readonly searchQuery = signal('');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const active = this.catalog().filter((product) => product.status === 'active');
    if (!query) {
      return active.slice(0, 8);
    }
    return active
      .filter((product) => {
        const haystack = `${product.name} ${product.sku} ${product.category} ${product.barcode ?? ''}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 12);
  });

  readonly subtotal = computed(() =>
    round2(this.lines().reduce((sum, line) => sum + line.quantity * line.unit_price, 0)),
  );

  readonly taxAmount = computed(() =>
    round2(
      this.lines().reduce(
        (sum, line) => sum + line.quantity * line.unit_price * (line.tax_rate / 100),
        0,
      ),
    ),
  );

  readonly totalAmount = computed(() => round2(this.subtotal() + this.taxAmount()));

  readonly customerForm = this.fb.nonNullable.group({
    customer_name: ['Walk-in customer', [Validators.required, Validators.maxLength(160)]],
    customer_phone: [''],
    customer_email: [''],
    payment_method: this.fb.nonNullable.control<PaymentMethod>('cash', Validators.required),
    notes: [''],
  });

  readonly addForm = this.fb.nonNullable.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.currentShop.ensureShop().subscribe({
      next: () => this.reloadCatalog(),
      error: () => this.reloadCatalog(),
    });
  }

  reloadCatalog(): void {
    this.loading.set(true);
    this.error.set('');
    this.productsApi
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (products) => this.catalog.set(products),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load products.')),
      });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  selectProduct(product: Product): void {
    const quantity = Math.max(1, Number(this.addForm.controls.quantity.value) || 1);
    const existing = this.lines().find((line) => line.product.id === product.id);
    if (existing) {
      this.lines.update((rows) =>
        rows.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        ),
      );
    } else {
      this.lines.update((rows) => [
        ...rows,
        {
          product,
          quantity,
          unit_price: product.price,
          tax_rate: product.tax_rate ?? 0,
        },
      ]);
    }
    this.addForm.controls.quantity.setValue(1);
    this.searchQuery.set('');
    this.error.set('');
  }

  updateQuantity(productId: string, quantity: number): void {
    const next = Math.max(1, Math.floor(Number(quantity) || 1));
    this.lines.update((rows) =>
      rows.map((line) => (line.product.id === productId ? { ...line, quantity: next } : line)),
    );
  }

  removeLine(productId: string): void {
    this.lines.update((rows) => rows.filter((line) => line.product.id !== productId));
  }

  clearBill(): void {
    this.lines.set([]);
    this.error.set('');
  }

  createOrder(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    if (this.lines().length === 0) {
      this.error.set('Add at least one product to the bill.');
      return;
    }

    const storeId = this.currentShop.storeId() || this.currentShop.shop()?.id;
    if (!storeId) {
      this.error.set('Save your shop on Overview before creating an order.');
      return;
    }

    const customer = this.customerForm.getRawValue();
    const phone = customer.customer_phone.trim();
    if (phone && !/^\+[1-9]\d{7,14}$/.test(phone)) {
      this.error.set('Phone must be in E.164 format, e.g. +919876543210.');
      return;
    }

    const email = customer.customer_email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set('Enter a valid email, or leave it blank.');
      return;
    }

    const items: OrderLineItem[] = this.lines().map((line) => ({
      product_id: line.product.id,
      product_name: line.product.name,
      sku: line.product.sku,
      quantity: line.quantity,
      unit_price: line.unit_price,
    }));

    const subtotal = this.subtotal();
    const taxAmount = this.taxAmount();
    const totalAmount = this.totalAmount();

    this.saving.set(true);
    this.error.set('');
    this.ordersApi
      .create({
        store_id: storeId,
        customer_name: customer.customer_name.trim(),
        customer_phone: phone || null,
        customer_email: email || null,
        items,
        billing: {
          subtotal,
          tax_amount: taxAmount,
          discount_amount: 0,
          shipping_amount: 0,
          total_amount: totalAmount,
          currency: 'INR',
          payment_method: customer.payment_method,
          payment_status: customer.payment_method === 'cash' ? 'paid' : 'pending',
          billing_address: null,
        },
        status: 'confirmed',
        notes: customer.notes.trim() || null,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/back-office/orders');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not create order.')),
      });
  }

  lineTotal(line: BillLine): number {
    return round2(line.quantity * line.unit_price);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: unknown } })?.error?.detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string };
      if (typeof first?.msg === 'string') {
        return first.msg;
      }
    }
    return fallback;
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
