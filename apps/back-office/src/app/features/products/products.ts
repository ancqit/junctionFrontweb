import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Product, ProductStatus } from '../../core/models';
import { ProductsApi } from '../../core/products.api';
import { DEFAULT_STORE_ID } from '../../core/store.config';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, CurrencyPipe, TitleCasePipe],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsPage implements OnInit {
  private readonly api = inject(ProductsApi);
  private readonly fb = inject(FormBuilder);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly showForm = signal(false);

  readonly form = this.fb.nonNullable.group({
    sku: ['', [Validators.required, Validators.maxLength(64)]],
    name: ['', [Validators.required, Validators.maxLength(160)]],
    description: [''],
    category: ['', [Validators.required, Validators.maxLength(80)]],
    price: [0, [Validators.required, Validators.min(0)]],
    cost_price: [''],
    stock_quantity: [0, [Validators.required, Validators.min(0)]],
    unit: ['piece', [Validators.required, Validators.maxLength(32)]],
    status: this.fb.nonNullable.control<ProductStatus>('active', Validators.required),
    tags: [''],
    barcode: [''],
    tax_rate: [''],
    low_stock_threshold: [''],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.products.set(rows),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load products.')),
      });
  }

  openForm(): void {
    this.showForm.set(true);
    this.error.set('');
  }

  closeForm(): void {
    this.showForm.set(false);
    this.form.reset({
      sku: '',
      name: '',
      description: '',
      category: '',
      price: 0,
      cost_price: '',
      stock_quantity: 0,
      unit: 'piece',
      status: 'active',
      tags: '',
      barcode: '',
      tax_rate: '',
      low_stock_threshold: '',
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');
    this.api
      .create({
        store_id: DEFAULT_STORE_ID,
        sku: value.sku.trim(),
        name: value.name.trim(),
        description: value.description.trim() || null,
        category: value.category.trim(),
        price: Number(value.price),
        cost_price: value.cost_price === '' ? null : Number(value.cost_price),
        currency: 'INR',
        stock_quantity: Number(value.stock_quantity),
        unit: value.unit.trim() || 'piece',
        status: value.status,
        tags: value.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        image_url: null,
        barcode: value.barcode.trim() || null,
        tax_rate: value.tax_rate === '' ? null : Number(value.tax_rate),
        low_stock_threshold:
          value.low_stock_threshold === '' ? null : Number(value.low_stock_threshold),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.closeForm();
          this.reload();
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not create product.')),
      });
  }

  remove(product: Product): void {
    if (!confirm(`Remove ${product.name}?`)) {
      return;
    }
    this.api.remove(product.id).subscribe({
      next: () => this.reload(),
      error: (err: unknown) => this.error.set(this.readError(err, 'Could not delete product.')),
    });
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
