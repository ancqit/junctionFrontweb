import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DescriptionsApi } from '../../core/descriptions.api';
import { ImageSearchResult, UserProfile } from '../../core/models';
import { ProfileApi } from '../../core/profile.api';
import { QueriesApi } from '../../core/queries.api';
import { SHOP_TYPE_OPTIONS, shopTypeLabel } from '../../core/shop-types.catalog';

/** Wizard while unset; `profile` is the locked one-profile view after save. */
export type ProfileWizardStep = 'keyword' | 'prompts' | 'review' | 'profile';

const PROFILE_QUESTIONS = [
  {
    control: 'prompt1' as const,
    label: 'What do you sell or offer?',
    placeholder: 'e.g. Fresh vegetables, rice, and daily groceries',
  },
  {
    control: 'prompt2' as const,
    label: 'What makes your shop special?',
    placeholder: 'e.g. Local produce every morning and fair prices',
  },
  {
    control: 'prompt3' as const,
    label: 'What should customers know about you?',
    placeholder: 'e.g. Open early, home delivery on Main Road',
  },
];

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit {
  private readonly profileApi = inject(ProfileApi);
  private readonly descriptionsApi = inject(DescriptionsApi);
  private readonly queriesApi = inject(QueriesApi);
  private readonly fb = inject(FormBuilder);

  readonly shopTypeOptions = SHOP_TYPE_OPTIONS;
  readonly questions = PROFILE_QUESTIONS;
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
  /** Exact `{ description }` from POST /descriptions/generate. */
  readonly generatedDescription = signal('');
  readonly imageResults = signal<ImageSearchResult[]>([]);
  readonly selectedAvatarUrl = signal<string | null>(null);
  readonly editingBio = signal(false);

  readonly keywordForm = this.fb.nonNullable.group({
    keyword: ['', [Validators.required, Validators.maxLength(120)]],
    shop_type: ['', [Validators.required]],
  });

  readonly promptsForm = this.fb.nonNullable.group({
    prompt1: ['', [Validators.required, Validators.maxLength(400)]],
    prompt2: ['', [Validators.required, Validators.maxLength(400)]],
    prompt3: ['', [Validators.required, Validators.maxLength(400)]],
  });

  readonly reviewForm = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.maxLength(100)]],
    bio: ['', [Validators.required, Validators.maxLength(500)]],
  });

  readonly manageForm = this.fb.nonNullable.group({
    bio: ['', [Validators.maxLength(500)]],
  });

  readonly selectedShopTypeLabel = computed(() => shopTypeLabel(this.selectedShopType()));
  /** One profile only — bio on the user document means the profile is set. */
  readonly hasProfile = computed(() => !!this.profile()?.bio?.trim());
  readonly inWizard = computed(() => this.step() !== 'profile');

  readonly stepIndex = computed(() => {
    switch (this.step()) {
      case 'keyword':
        return 1;
      case 'prompts':
        return 2;
      case 'review':
        return 3;
      case 'profile':
        return 4;
    }
  });

  ngOnInit(): void {
    this.reloadProfile(true);
  }

  reloadProfile(preferProfileIfSet = false): void {
    this.loading.set(true);
    this.error.set('');
    this.profileApi
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.selectedAvatarUrl.set(profile.avatar_url ?? null);
          if (preferProfileIfSet && profile.bio?.trim()) {
            this.showProfileView(profile, '');
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
    const raw = this.keywordForm.getRawValue();
    this.keyword.set(raw.keyword.trim());
    this.selectedShopType.set(raw.shop_type.trim());
    this.error.set('');
    this.success.set('');
    this.step.set('prompts');
  }

  backToKeyword(): void {
    this.step.set('keyword');
    this.error.set('');
  }

  /**
   * After all three questions, call junctionBack `POST /descriptions/generate`
   * and show the returned `{ description }` on the review step.
   */
  enhancePrompts(): void {
    if (this.promptsForm.invalid) {
      this.promptsForm.markAllAsTouched();
      this.error.set('Answer all three questions so Gemini can write your description.');
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

    if (sentences.length < 3) {
      this.error.set('Answer all three questions before generating a description.');
      return;
    }

    this.enhancing.set(true);
    this.error.set('');
    this.success.set('');
    this.promptSentences.set(sentences);
    this.generatedDescription.set('');

    this.descriptionsApi.generate(this.buildDescriptionSummary(sentences)).subscribe({
      next: (response) => {
        const description = (response.description ?? '').trim();
        this.enhancing.set(false);
        if (!description) {
          this.error.set('Gemini returned an empty description. Try adjusting your answers.');
          return;
        }
        const bio = description.slice(0, 500);
        this.generatedDescription.set(bio);
        const existingName = this.profile()?.display_name?.trim();
        this.reviewForm.patchValue({
          display_name: existingName || this.keyword(),
          bio,
        });
        this.selectedAvatarUrl.set(this.profile()?.avatar_url ?? null);
        this.step.set('review');
        this.loadAvatarOptions();
      },
      error: (err: unknown) => {
        this.enhancing.set(false);
        this.error.set(
          this.readError(err, 'Could not generate a description. Check Gemini on junctionBack and try again.'),
        );
      },
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

  /** One profile — save once, then toggle to the profile view. */
  saveProfile(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const raw = this.reviewForm.getRawValue();
    const displayName = raw.display_name.trim();
    const bio = raw.bio.trim();
    const avatarUrl = this.selectedAvatarUrl()?.trim() || undefined;

    if (!bio) {
      this.error.set('A generated description is required before saving your profile.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.profileApi
      .update({
        display_name: displayName,
        bio,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.showProfileView(profile, 'Profile saved. This is your Junction profile.');
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not save profile.')),
      });
  }

  startEditBio(): void {
    this.manageForm.patchValue({ bio: this.profile()?.bio ?? '' });
    this.editingBio.set(true);
    this.error.set('');
    this.success.set('');
  }

  cancelEditBio(): void {
    this.editingBio.set(false);
    this.manageForm.patchValue({ bio: this.profile()?.bio ?? '' });
    this.error.set('');
  }

  updateBio(): void {
    const bio = this.manageForm.controls.bio.value.trim();
    if (!bio) {
      this.error.set('Bio cannot be empty while keeping this profile. Use Delete profile to clear it.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .update({ bio })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.manageForm.patchValue({ bio: profile.bio ?? '' });
          this.editingBio.set(false);
          this.success.set('Profile description updated.');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not update bio.')),
      });
  }

  /** Clears bio so the one-profile wizard can run again. */
  deleteProfile(): void {
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .update({ bio: null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.editingBio.set(false);
          this.resetWizardState();
          this.success.set('Profile cleared. Answer the three questions to create a new one.');
          this.step.set('keyword');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not clear profile.')),
      });
  }

  private showProfileView(profile: UserProfile, message: string): void {
    this.manageForm.patchValue({ bio: profile.bio ?? '' });
    this.selectedAvatarUrl.set(profile.avatar_url ?? null);
    this.editingBio.set(false);
    if (message) {
      this.success.set(message);
    }
    this.step.set('profile');
  }

  private resetWizardState(): void {
    this.keywordForm.reset({ keyword: '', shop_type: '' });
    this.promptsForm.reset({ prompt1: '', prompt2: '', prompt3: '' });
    this.reviewForm.reset({ display_name: '', bio: '' });
    this.manageForm.reset({ bio: '' });
    this.keyword.set('');
    this.promptSentences.set([]);
    this.generatedDescription.set('');
    this.imageResults.set([]);
    this.selectedAvatarUrl.set(null);
    this.selectedShopType.set(null);
  }

  private asSentence(value: string): string {
    const trimmed = value.replace(/\s+/g, ' ').trim();
    if (!trimmed) {
      return '';
    }
    const capped = trimmed[0].toUpperCase() + trimmed.slice(1);
    return /[.!?]$/.test(capped) ? capped : `${capped}.`;
  }

  /**
   * Build the `text` body for POST /descriptions/generate.
   * Backend wraps this in a product-description prompt — we pass a shop summary
   * so Gemini returns a proper customer-facing description.
   */
  private buildDescriptionSummary(sentences: string[]): string {
    const keyword = this.keyword().trim() || 'local shop';
    const typeLabel =
      shopTypeLabel(this.selectedShopType()) ||
      this.shopTypeOptions.find((row) => row.value === this.keywordForm.controls.shop_type.value)?.label ||
      'shop';
    const summary = [
      `${keyword} — ${typeLabel} on Junction.`,
      ...sentences,
      'Write a clear, inviting shop description customers would read on a profile page.',
    ].join(' ');
    return summary.slice(0, 2000);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
