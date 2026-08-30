import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, from, Observable, of } from 'rxjs';
import { concatMap, last, map, switchMap } from 'rxjs/operators';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import {
  ImageSearchResult,
  PRODUCT_PACK_PRICE_INR,
  PRODUCT_PACK_SIZE,
  Product,
  ProductStatus,
} from '../../core/models';
import { PaymentsApi, ShopPayment } from '../../core/payments.api';
import {
  DEFAULT_PACK_PRICE_INR,
  DEFAULT_PACK_SIZE,
  ProductBucket,
  ProductBucketApi,
} from '../../core/product-bucket.api';
import { ProductsApi } from '../../core/products.api';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';

const MAX_PRODUCT_IMAGES = 5;
const PEXELS_RESULT_COUNT = 10;

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
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    TitleCasePipe,
    InlineSelectComponent,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsPage implements OnInit, OnDestroy {
  private readonly api = inject(ProductsApi);
  private readonly bucketApi = inject(ProductBucketApi);
  private readonly paymentsApi = inject(PaymentsApi);
  private readonly fb = inject(FormBuilder);
  private readonly i18n = inject(I18nService);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('localFileInput');

  readonly maxImages = MAX_PRODUCT_IMAGES;
  readonly productStatusOptions = computed<InlineSelectOption[]>(() => {
    this.i18n.lang();
    return [
      { value: 'active', label: this.i18n.t('common.active') },
      { value: 'inactive', label: this.i18n.t('common.inactive') },
      { value: 'discontinued', label: this.i18n.t('common.discontinued') },
    ];
  });
  readonly products = signal<Product[]>([]);
  readonly storedImageUrls = signal<Record<string, string>>({});
  readonly bucket = signal<ProductBucket | null>(null);
  readonly bucketBusy = signal(false);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly categoryCatalog = signal<{ value: string; label: string }[]>([]);

  readonly searchQuery = signal('');
  readonly categoryFilter = signal('');
  readonly activeTag = signal<string | null>(null);

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

  readonly categoryOptions = computed<InlineSelectOption[]>(() => {
    this.i18n.lang();
    const catalog = this.categoryCatalog();
    return [
      { value: '', label: this.i18n.t('products.allCategories') },
      ...catalog.map((row) => ({ value: row.value, label: row.label })),
    ];
  });

  readonly formCategoryOptions = computed<InlineSelectOption[]>(() => {
    this.i18n.lang();
    const catalog = this.categoryCatalog();
    return catalog.length
      ? catalog.map((row) => ({ value: row.value, label: row.label }))
      : [{ value: 'other', label: this.i18n.t('common.other') }];
  });

  /** Tags shown above the list for filtering (product.tags only). */
  readonly descriptionTags = computed(() => {
    const tags = new Set<string>();
    for (const product of this.products()) {
      for (const tag of product.tags ?? []) {
        const trimmed = tag.trim();
        if (trimmed) {
          tags.add(trimmed);
        }
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b));
  });

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.categoryFilter().trim().toLowerCase();
    const tag = this.activeTag()?.trim().toLowerCase() ?? '';
    return this.products().filter((product) => {
      if (category && product.category.trim().toLowerCase() !== category) {
        return false;
      }
      if (tag) {
        const inTags = (product.tags ?? []).some((row) => row.trim().toLowerCase() === tag);
        if (!inTags) {
          return false;
        }
      }
      if (!query) {
        return true;
      }
      const haystack = [
        product.name,
        product.category,
        ...(product.tags ?? []),
        product.sku,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly capacityLabel = computed(() => {
    this.i18n.lang();
    const bucket = this.bucket();
    if (!bucket) {
      return '';
    }
    const planName = bucket.plan_name?.trim() || this.i18n.t('products.thisPlan');
    if (bucket.capacity == null) {
      return this.i18n.t('products.capacitySimple', {
        count: bucket.products_count,
        plan: planName,
      });
    }
    return this.i18n.t('products.capacityFullLabel', {
      count: bucket.products_count,
      cap: bucket.capacity,
      plan: planName,
    });
  });

  /** True when plan + pack capacity is fully used. */
  readonly capacityFull = computed(() => {
    const bucket = this.bucket();
    if (!bucket || bucket.capacity == null) {
      return false;
    }
    return bucket.remaining === 0 || bucket.products_count >= bucket.capacity || !bucket.can_add_product;
  });

  readonly packSize = computed(
    () => this.bucket()?.pack_size ?? DEFAULT_PACK_SIZE ?? PRODUCT_PACK_SIZE,
  );
  readonly packPrice = computed(
    () => this.bucket()?.pack_price_inr ?? DEFAULT_PACK_PRICE_INR ?? PRODUCT_PACK_PRICE_INR,
  );

  ngOnInit(): void {
    this.api.categories().subscribe({
      next: (rows) =>
        this.categoryCatalog.set(rows.map((row) => ({ value: row.value, label: row.label }))),
      error: () => this.categoryCatalog.set([]),
    });
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

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  onCategoryFilter(value: string): void {
    this.categoryFilter.set(value);
  }

  toggleTag(tag: string): void {
    this.activeTag.update((current) => (current === tag ? null : tag));
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.categoryFilter.set('');
    this.activeTag.set(null);
  }

  /**
   * After plan allowance is used: buy one pack (payment) or go change plan.
   * Admins may get capacity immediately from `/slots`.
   */
  addProductPack(): void {
    const bucket = this.bucket();
    if (!bucket || bucket.plan_limit == null || !bucket.plan_allowance_consumed) {
      return;
    }
    this.bucketBusy.set(true);
    this.error.set('');
    this.bucketApi
      .purchasePacks(1)
      .pipe(finalize(() => this.bucketBusy.set(false)))
      .subscribe({
        next: (result) => {
          if (!result) {
            return;
          }
          if (this.isBucket(result)) {
            this.bucket.set(result);
            return;
          }
          const payment = result as ShopPayment;
          if (payment.status === 'pending' && payment.id) {
            this.paymentsApi
              .complete(payment.id, { payment_method: 'other', payment_reference: 'back-office' })
              .subscribe({
                next: (done) => {
                  if (done.bucket) {
                    this.bucket.set(done.bucket);
                  } else {
                    this.reloadBucket();
                  }
                },
                error: (err: unknown) =>
                  this.error.set(this.readError(err, 'Payment could not be completed.')),
              });
            return;
          }
          this.reloadBucket();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not add more product capacity.')),
      });
  }

  openForm(): void {
    const bucket = this.bucket();
    if (bucket && !bucket.can_add_product) {
      this.error.set(
        bucket.plan_allowance_consumed
          ? 'Product limit reached. Add more products or change plan.'
          : 'Your plan does not allow more products right now.',
      );
      return;
    }
    this.editingId.set(null);
    this.showForm.set(true);
    this.error.set('');
    this.resetImagePicker();
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
  }

  openEdit(product: Product): void {
    this.editingId.set(product.id);
    this.showForm.set(true);
    this.error.set('');
    this.resetImagePicker();
    this.form.reset({
      name: product.name,
      description: product.description ?? '',
      category: product.category,
      price: product.price,
      cost_price: product.cost_price != null ? String(product.cost_price) : '',
      stock_quantity: product.stock_quantity,
      unit: product.unit || 'piece',
      status: product.status,
      tags: (product.tags ?? []).join(', '),
      barcode: product.barcode ?? '',
      tax_rate: product.tax_rate != null ? String(product.tax_rate) : '',
      low_stock_threshold:
        product.low_stock_threshold != null ? String(product.low_stock_threshold) : '',
    });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
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
    const description = value.description.trim();
    const tags = value.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const editingId = this.editingId();

    const payload = {
      name: value.name.trim(),
      description: description || null,
      category: value.category.trim(),
      price: Number(value.price),
      cost_price: value.cost_price === '' ? null : Number(value.cost_price),
      currency: 'INR' as const,
      stock_quantity: Number(value.stock_quantity),
      unit: value.unit.trim() || 'piece',
      status: value.status,
      tags,
      barcode: value.barcode.trim() || null,
      tax_rate: value.tax_rate === '' ? null : Number(value.tax_rate),
      low_stock_threshold:
        value.low_stock_threshold === '' ? null : Number(value.low_stock_threshold),
    };

    this.saving.set(true);
    this.error.set('');

    if (editingId) {
      this.api
        .update(editingId, payload)
        .pipe(
          switchMap((updated) =>
            drafts.length ? this.persistProductImages(updated.id, drafts) : of(undefined),
          ),
        )
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.closeForm();
            this.reload();
          },
          error: (err: unknown) => {
            this.saving.set(false);
            this.error.set(this.readError(err, 'Could not update product.'));
          },
        });
      return;
    }

    this.api
      .create({
        ...payload,
        sku: this.generateSku(value.name),
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
    return product.image_url || product.image_cdn || product.image?.cdn || null;
  }

  private isBucket(value: ProductBucket | ShopPayment): value is ProductBucket {
    return 'products_count' in value && 'can_add_product' in value;
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
