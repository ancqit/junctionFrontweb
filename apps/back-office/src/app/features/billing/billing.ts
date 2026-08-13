import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { downloadBillPdf } from '../../core/bill-pdf';
import { CurrentShopService } from '../../core/current-shop.service';
import { Order, OrderLineItem, PaymentMethod, Product } from '../../core/models';
import { OrdersApi } from '../../core/orders.api';
import { ProductsApi } from '../../core/products.api';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';

const PAYMENT_METHOD_OPTIONS: InlineSelectOption[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'other', label: 'Other' },
];

interface BillLine {
  product: Product;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

@Component({
  selector: 'app-billing',
  imports: [ReactiveFormsModule, CurrencyPipe, InlineSelectComponent],
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
  readonly success = signal('');
  readonly paymentMethodOptions = PAYMENT_METHOD_OPTIONS;

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
    phone_local: ['', [Validators.pattern(/^$|^[6-9]\d{9}$/)]],
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
    this.success.set('');
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
    const phoneLocal = customer.phone_local.trim();
    const phone = phoneLocal ? `+91${phoneLocal}` : null;

    const email = customer.customer_email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set('Enter a valid email, or leave it blank.');
      return;
    }

    const billLines = this.lines();
    const items: OrderLineItem[] = billLines.map((line) => ({
      product_id: line.product.id,
      product_name: line.product.name,
      sku: line.product.sku,
      quantity: line.quantity,
      unit_price: line.unit_price,
    }));

    const subtotal = this.subtotal();
    const taxAmount = this.taxAmount();
    const totalAmount = this.totalAmount();
    const shopName = this.currentShop.shop()?.name?.trim() || 'Junction shop';

    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.ordersApi
      .create({
        store_id: storeId,
        customer_name: customer.customer_name.trim(),
        customer_phone: phone,
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
        next: (order: Order) => {
          downloadBillPdf({
            shopName,
            orderNumber: order.order_number,
            customerName: customer.customer_name.trim(),
            customerPhone: phone,
            paymentMethod: customer.payment_method,
            lines: billLines.map((line) => ({
              name: line.product.name,
              quantity: line.quantity,
              unitPrice: line.unit_price,
              lineTotal: round2(line.quantity * line.unit_price),
            })),
            subtotal,
            taxAmount,
            totalAmount,
            currency: 'INR',
            createdAt: order.created_at ? new Date(order.created_at) : new Date(),
          });
          this.success.set('Bill created — PDF downloaded.');
          this.lines.set([]);
          this.customerForm.patchValue({
            customer_name: 'Walk-in customer',
            phone_local: '',
            customer_email: '',
            notes: '',
            payment_method: 'cash',
          });
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
