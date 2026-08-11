import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { DescriptionsApi } from '../../core/descriptions.api';
import { ImageSearchResult, UserProfile } from '../../core/models';
import { ProfileApi } from '../../core/profile.api';
import { QueriesApi } from '../../core/queries.api';
import { SHOP_TYPE_OPTIONS, shopTypeLabel } from '../../core/shop-types.catalog';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';

const SHOP_TYPE_SELECT_OPTIONS: InlineSelectOption[] = [
  { value: '', label: 'Select the type of shop' },
  ...SHOP_TYPE_OPTIONS.map((row) => ({ value: row.value, label: row.label })),
];

export type ProfileWizardStep = 'keyword' | 'prompts' | 'review' | 'done' | 'manage';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, RouterLink, InlineSelectComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit {
  private readonly profileApi = inject(ProfileApi);
  private readonly descriptionsApi = inject(DescriptionsApi);
  private readonly queriesApi = inject(QueriesApi);
  private readonly fb = inject(FormBuilder);

  readonly shopTypeOptions = SHOP_TYPE_OPTIONS;
  readonly shopTypeSelectOptions = SHOP_TYPE_SELECT_OPTIONS;
  readonly step = signal<ProfileWizardStep>('keyword');
  readonly profile = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly enhancing = signal(false);
  readonly searchingImages = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly keyword = signal('');
  readonly selectedShopType = signal<string | null>(null);
  readonly promptSentences = signal<string[]>([]);
  readonly imageResults = signal<ImageSearchResult[]>([]);
  readonly selectedAvatarUrl = signal<string | null>(null);

  readonly keywordForm = this.fb.nonNullable.group({
    keyword: ['', [Validators.required, Validators.maxLength(120)]],
  });

  readonly promptsForm = this.fb.nonNullable.group({
    prompt1: ['', [Validators.required, Validators.maxLength(500)]],
    prompt2: ['', [Validators.maxLength(500)]],
    prompt3: ['', [Validators.maxLength(500)]],
  });

  readonly reviewForm = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.maxLength(100)]],
    bio: ['', [Validators.maxLength(500)]],
    shop_type: ['', [Validators.required]],
  });

  readonly manageForm = this.fb.nonNullable.group({
    bio: ['', [Validators.maxLength(500)]],
  });

  readonly selectedShopTypeLabel = computed(() => shopTypeLabel(this.selectedShopType()));
  readonly hasExistingBio = computed(() => !!this.profile()?.bio?.trim());

  readonly stepIndex = computed(() => {
    switch (this.step()) {
      case 'keyword':
        return 1;
      case 'prompts':
        return 2;
      case 'review':
        return 3;
      case 'done':
      case 'manage':
        return 4;
    }
  });

  ngOnInit(): void {
    this.reloadProfile(true);
  }

  reloadProfile(preferManageIfBio = false): void {
    this.loading.set(true);
    this.error.set('');
    this.profileApi
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          if (preferManageIfBio && profile.bio?.trim()) {
            this.manageForm.patchValue({ bio: profile.bio });
            this.step.set('manage');
          }
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load profile.')),
      });
  }

  continueFromKeyword(): void {
    if (this.keywordForm.invalid) {
      this.keywordForm.markAllAsTouched();
      return;
    }
    const value = this.keywordForm.controls.keyword.value.trim();
    this.keyword.set(value);
    this.error.set('');
    this.success.set('');
    this.step.set('prompts');
  }

  backToKeyword(): void {
    this.step.set('keyword');
    this.error.set('');
  }

  enhancePrompts(): void {
    if (this.promptsForm.controls.prompt1.invalid) {
      this.promptsForm.markAllAsTouched();
      return;
    }

    const sentences = [
      this.promptsForm.controls.prompt1.value,
      this.promptsForm.controls.prompt2.value,
      this.promptsForm.controls.prompt3.value,
    ]
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => this.asSentence(value));

    if (sentences.length === 0) {
      this.error.set('Add at least one short prompt for Gemini to enhance.');
      return;
    }

    this.enhancing.set(true);
    this.error.set('');
    this.success.set('');
    this.promptSentences.set(sentences);

    // junctionBack only exposes POST /descriptions/generate (Gemini text).
    // There is no dedicated bio endpoint — we send one concatenated prompt for a full bio.
    this.descriptionsApi
      .generate(this.buildBioEnhanceInput(sentences))
      .pipe(
        map((response) => response.description.trim()),
        catchError(() => of(sentences.join(' '))),
        finalize(() => this.enhancing.set(false)),
      )
      .subscribe({
        next: (bio) => {
          const existingName = this.profile()?.display_name?.trim();
          this.reviewForm.patchValue({
            display_name: existingName || this.keyword(),
            bio: bio.slice(0, 500),
            shop_type: this.selectedShopType() ?? this.guessShopTypeFromKeyword() ?? '',
          });
          this.selectedAvatarUrl.set(this.profile()?.avatar_url ?? null);
          this.step.set('review');
          this.loadAvatarOptions();
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Gemini could not enhance your prompts.')),
      });
  }

  backToPrompts(): void {
    this.step.set('prompts');
    this.error.set('');
  }

  loadAvatarOptions(): void {
    const query = this.keyword().trim();
    if (!query) {
      return;
    }
    this.searchingImages.set(true);
    this.queriesApi
      .searchImages(query, 1, 6)
      .pipe(finalize(() => this.searchingImages.set(false)))
      .subscribe({
        next: (response) => this.imageResults.set(response.images),
        error: () => this.imageResults.set([]),
      });
  }

  selectAvatar(image: ImageSearchResult): void {
    const url = String(image.cdn_url);
    this.selectedAvatarUrl.update((current) => (current === url ? null : url));
  }

  isAvatarSelected(image: ImageSearchResult): boolean {
    return this.selectedAvatarUrl() === String(image.cdn_url);
  }

  saveProfile(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const raw = this.reviewForm.getRawValue();
    const displayName = raw.display_name.trim();
    const bio = raw.bio.trim();
    const shopType = raw.shop_type.trim();
    const avatarUrl = this.selectedAvatarUrl()?.trim() || undefined;

    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.selectedShopType.set(shopType || null);

    this.profileApi
      .update({
        display_name: displayName,
        bio: bio || null,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.manageForm.patchValue({ bio: profile.bio ?? '' });
          this.success.set('Profile created and saved.');
          this.step.set('done');
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not save profile.')),
      });
  }

  openManageBio(): void {
    this.manageForm.patchValue({ bio: this.profile()?.bio ?? '' });
    this.error.set('');
    this.success.set('');
    this.step.set('manage');
  }

  updateBio(): void {
    const bio = this.manageForm.controls.bio.value.trim();
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .update({ bio: bio || null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.manageForm.patchValue({ bio: profile.bio ?? '' });
          this.success.set(bio ? 'Bio updated.' : 'Bio cleared.');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not update bio.')),
      });
  }

  deleteBio(): void {
    this.manageForm.patchValue({ bio: '' });
    this.updateBio();
  }

  startOver(): void {
    this.keywordForm.reset({ keyword: this.keyword() });
    this.promptsForm.reset({ prompt1: '', prompt2: '', prompt3: '' });
    this.reviewForm.reset({ display_name: '', bio: '', shop_type: '' });
    this.manageForm.reset({ bio: '' });
    this.promptSentences.set([]);
    this.imageResults.set([]);
    this.selectedAvatarUrl.set(null);
    this.selectedShopType.set(null);
    this.success.set('');
    this.error.set('');
    this.step.set('keyword');
  }

  private asSentence(value: string): string {
    const trimmed = value.replace(/\s+/g, ' ').trim();
    if (!trimmed) {
      return '';
    }
    const capped = trimmed[0].toUpperCase() + trimmed.slice(1);
    return /[.!?]$/.test(capped) ? capped : `${capped}.`;
  }

  private guessShopTypeFromKeyword(): string | null {
    const keyword = this.keyword().trim().toLowerCase();
    if (!keyword) {
      return null;
    }
    const match = this.shopTypeOptions.find(
      (row) =>
        row.label.toLowerCase().includes(keyword) ||
        row.description.toLowerCase().includes(keyword) ||
        row.value.replace(/_/g, ' ').includes(keyword),
    );
    return match?.value ?? null;
  }

  private buildBioEnhanceInput(sentences: string[]): string {
    const keyword = this.keyword().trim();
    const shopType = shopTypeLabel(this.selectedShopType()) || this.guessShopTypeFromKeyword() || 'shop';
    return [
      'You are writing a Junction shop-owner profile bio.',
      `Profile keyword: ${keyword}`,
      `Shop type context: ${shopType}`,
      'Combine the following owner notes into one cohesive full-length bio paragraph.',
      'Use complete sentences, keep a warm professional tone, and stay under 480 characters.',
      'Do not invent facts that are not implied by the notes. Return only the bio text.',
      '',
      'Owner notes (already as sentences):',
      ...sentences.map((line, index) => `${index + 1}. ${line}`),
    ].join('\n');
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
