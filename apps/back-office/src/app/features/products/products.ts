import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, from, Observable, of } from 'rxjs';
import { concatMap, last, map, switchMap } from 'rxjs/operators';
import { ImageSearchResult, Product, ProductStatus } from '../../core/models';
import { ProductBucket, ProductBucketApi } from '../../core/product-bucket.api';
import { ProductsApi } from '../../core/products.api';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';

const PRODUCT_STATUS_OPTIONS: InlineSelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
];

const MAX_PRODUCT_IMAGES = 5;
const PEXELS_RESULT_COUNT = 10;
/** Default pack when adding bucket capacity after plan allowance is used. */
const DEFAULT_BUCKET_PACK = 10;

export type ProductImageDraftSource = 'pexels' | 'local';

export interface ProductImageDraft {
  id: string;
  source: ProductImageDraftSource;
  previewUrl: string;
  cdnUrl?: string;
  file?: File;
  alt: string;
}

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, CurrencyPipe, TitleCasePipe, InlineSelectComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsPage implements OnInit, OnDestroy {
  private readonly api = inject(ProductsApi);
  private readonly bucketApi = inject(ProductBucketApi);
  private readonly fb = inject(FormBuilder);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('localFileInput');

  readonly maxImages = MAX_PRODUCT_IMAGES;
  readonly productStatusOptions = PRODUCT_STATUS_OPTIONS;
  readonly products = signal<Product[]>([]);
  /** Object URLs for CatalogReader-protected stored images (keyed by product id). */
  readonly storedImageUrls = signal<Record<string, string>>({});
  readonly bucket = signal<ProductBucket | null>(null);
  readonly bucketBusy = signal(false);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly showForm = signal(false);

  readonly pexelsResults = signal<ImageSearchResult[]>([]);
  readonly selectedImages = signal<ProductImageDraft[]>([]);
  readonly searchingPexels = signal(false);
  readonly imageError = signal('');

  readonly form = this.fb.nonNullable.group({
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

  ngOnDestroy(): void {
    this.revokeStoredImageUrls();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => {
          this.products.set(rows);
          this.hydrateStoredImages(rows);
          this.reloadBucket();
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load products.')),
      });
  }

  reloadBucket(): void {
    this.bucketApi.get().subscribe({
      next: (bucket) => this.bucket.set(bucket),
      error: () => this.bucket.set(null),
    });
  }

  addBucketSlots(quantity = DEFAULT_BUCKET_PACK): void {
    const bucket = this.bucket();
    if (!bucket || bucket.plan_limit == null || !bucket.plan_allowance_consumed) {
      return;
    }
    this.bucketBusy.set(true);
    this.error.set('');
    this.bucketApi
      .addSlots(quantity)
      .pipe(finalize(() => this.bucketBusy.set(false)))
      .subscribe({
        next: (next) => {
          if (next) {
            this.bucket.set(next);
          }
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not add product bucket capacity.')),
      });
  }

  bucketLabel(): string {
    const bucket = this.bucket();
    if (!bucket) {
      return '';
    }
    if (bucket.capacity == null) {
      return `${bucket.products_count} products · ${bucket.plan_name} (unlimited)`;
    }
    return `${bucket.products_count} / ${bucket.capacity} products · ${bucket.plan_name}`;
  }

  openForm(): void {
    const bucket = this.bucket();
    if (bucket && !bucket.can_add_product) {
      this.error.set(
        bucket.plan_allowance_consumed
          ? 'Product bucket is full. Add more capacity or upgrade your plan.'
          : 'Your plan does not allow more products right now.',
      );
      return;
    }
    this.showForm.set(true);
    this.error.set('');
    this.resetImagePicker();
  }

  closeForm(): void {
    this.showForm.set(false);
    this.form.reset({
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
    this.resetImagePicker();
  }

  canAddImages(): boolean {
    return this.selectedImages().length < MAX_PRODUCT_IMAGES;
  }

  searchPexels(): void {
    const productName = this.form.controls.name.value.trim();
    if (!productName) {
      this.form.controls.name.markAsTouched();
      this.imageError.set('Enter a product name first.');
      return;
    }
    if (!this.canAddImages()) {
      return;
    }

    this.searchingPexels.set(true);
    this.imageError.set('');
    this.api
      .suggestImages(productName)
      .pipe(finalize(() => this.searchingPexels.set(false)))
      .subscribe({
        next: (response) => {
          this.pexelsResults.set(response.images.slice(0, PEXELS_RESULT_COUNT));
          if (response.images.length === 0) {
            this.imageError.set('No Pexels pictures found for that name.');
          }
        },
        error: (err: unknown) =>
          this.imageError.set(this.readError(err, 'Could not search Pexels.')),
      });
  }

  openLocalPicker(): void {
    if (!this.canAddImages()) {
      return;
    }
    this.fileInput()?.nativeElement.click();
  }

  onLocalFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) {
      return;
    }

    const remaining = MAX_PRODUCT_IMAGES - this.selectedImages().length;
    const accepted = files.slice(0, remaining);
    if (files.length > remaining) {
      this.imageError.set(`You can add up to ${MAX_PRODUCT_IMAGES} pictures in total.`);
    } else {
      this.imageError.set('');
    }

    const drafts = accepted.map((file) => this.localDraftFromFile(file));
    this.selectedImages.update((rows) => [...rows, ...drafts]);
  }

  selectPexelsImage(image: ImageSearchResult): void {
    const cdnUrl = String(image.cdn_url);
    const existing = this.selectedImages().find(
      (row) => row.source === 'pexels' && row.cdnUrl === cdnUrl,
    );
    if (existing) {
      this.removeSelectedImage(existing.id);
      return;
    }
    if (!this.canAddImages()) {
      this.imageError.set(`You can add up to ${MAX_PRODUCT_IMAGES} pictures.`);
      return;
    }

    this.selectedImages.update((rows) => [
      ...rows,
      {
        id: `pexels-${image.id}`,
        source: 'pexels',
        previewUrl: String(image.thumbnail_url || image.cdn_url),
        cdnUrl,
        alt: image.alt || 'Pexels image',
      },
    ]);
    this.imageError.set('');
  }

  isPexelsSelected(image: ImageSearchResult): boolean {
    const cdnUrl = String(image.cdn_url);
    return this.selectedImages().some(
      (row) => row.source === 'pexels' && row.cdnUrl === cdnUrl,
    );
  }

  removeSelectedImage(id: string): void {
    const target = this.selectedImages().find((row) => row.id === id);
    if (target?.source === 'local' && target.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(target.previewUrl);
    }
    this.selectedImages.update((rows) => rows.filter((row) => row.id !== id));
    this.imageError.set('');
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const drafts = this.selectedImages();
    this.saving.set(true);
    this.error.set('');

    this.api
      .create({
        sku: this.generateSku(value.name),
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
        barcode: value.barcode.trim() || null,
        tax_rate: value.tax_rate === '' ? null : Number(value.tax_rate),
        low_stock_threshold:
          value.low_stock_threshold === '' ? null : Number(value.low_stock_threshold),
      })
      .pipe(switchMap((created) => this.persistProductImages(created.id, drafts)))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.reload();
        },
        error: (err: unknown) => {
          this.saving.set(false);
          this.error.set(this.readError(err, 'Could not create product.'));
        },
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

  productImageSrc(product: Product): string | null {
    const cached = this.storedImageUrls()[product.id];
    if (cached) {
      return cached;
    }
    const gallery = product.images ?? [];
    const hero = gallery[0] ?? product.image;
    if (hero?.cdn) {
      return hero.cdn;
    }
    // stored_image_id requires Bearer (CatalogReader) — hydrated async into storedImageUrls
    return product.image_url || product.image_cdn || product.image?.cdn || null;
  }

  private hydrateStoredImages(products: Product[]): void {
    this.revokeStoredImageUrls();
    for (const product of products) {
      const gallery = product.images ?? [];
      const hero = gallery[0] ?? product.image;
      if (hero?.cdn || !hero?.stored_image_id) {
        continue;
      }
      const productId = product.id;
      const imageId = hero.stored_image_id;
      this.api.fetchStoredImage(imageId).subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          this.storedImageUrls.update((current) => ({ ...current, [productId]: objectUrl }));
        },
      });
    }
  }

  private revokeStoredImageUrls(): void {
    for (const url of Object.values(this.storedImageUrls())) {
      URL.revokeObjectURL(url);
    }
    this.storedImageUrls.set({});
  }

  private persistProductImages(
    productId: string,
    drafts: ProductImageDraft[],
  ): Observable<void> {
    if (drafts.length === 0) {
      return of(undefined);
    }

    return from(drafts).pipe(
      concatMap((draft) => {
        if (draft.source === 'pexels' && draft.cdnUrl) {
          return this.api.useImageFromCdn(productId, draft.cdnUrl);
        }
        if (draft.source === 'local' && draft.file) {
          return this.api.uploadImage(productId, draft.file);
        }
        return of(undefined);
      }),
      last(),
      map(() => undefined),
    );
  }

  private localDraftFromFile(file: File): ProductImageDraft {
    return {
      id: `local-${crypto.randomUUID()}`,
      source: 'local',
      previewUrl: URL.createObjectURL(file),
      file,
      alt: file.name,
    };
  }

  private resetImagePicker(): void {
    for (const row of this.selectedImages()) {
      if (row.source === 'local' && row.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(row.previewUrl);
      }
    }
    this.pexelsResults.set([]);
    this.selectedImages.set([]);
    this.imageError.set('');
  }

  private generateSku(name: string): string {
    const slug = name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24);
    const suffix = Date.now().toString(36).toUpperCase();
    return `PRD-${slug || 'ITEM'}-${suffix}`.slice(0, 64);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
