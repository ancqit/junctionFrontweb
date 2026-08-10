import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { DescriptionsApi } from '../../core/descriptions.api';
import { ImageSearchResult, UserProfile } from '../../core/models';
import { ProfileApi } from '../../core/profile.api';
import { QueriesApi } from '../../core/queries.api';

export type ProfileWizardStep = 'keyword' | 'prompts' | 'review' | 'done';

export interface EnhancedPrompt {
  original: string;
  enhanced: string;
}

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

  readonly step = signal<ProfileWizardStep>('keyword');
  readonly profile = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly enhancing = signal(false);
  readonly searchingImages = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly keyword = signal('');
  readonly enhancedPrompts = signal<EnhancedPrompt[]>([]);
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
  });

  readonly stepIndex = computed(() => {
    switch (this.step()) {
      case 'keyword':
        return 1;
      case 'prompts':
        return 2;
      case 'review':
        return 3;
      case 'done':
        return 4;
    }
  });

  ngOnInit(): void {
    this.reloadProfile();
  }

  reloadProfile(): void {
    this.loading.set(true);
    this.error.set('');
    this.profileApi
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => this.profile.set(profile),
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

    const prompts = [
      this.promptsForm.controls.prompt1.value,
      this.promptsForm.controls.prompt2.value,
      this.promptsForm.controls.prompt3.value,
    ]
      .map((value) => value.trim())
      .filter(Boolean);

    if (prompts.length === 0) {
      this.error.set('Add at least one short prompt for Gemini to enhance.');
      return;
    }

    this.enhancing.set(true);
    this.error.set('');
    this.success.set('');

    forkJoin(
      prompts.map((original) =>
        this.descriptionsApi.generate(this.buildEnhanceInput(original)).pipe(
          map((response) => ({
            original,
            enhanced: response.description.trim() || original,
          })),
          catchError(() => of({ original, enhanced: original })),
        ),
      ),
    )
      .pipe(finalize(() => this.enhancing.set(false)))
      .subscribe({
        next: (rows) => {
          this.enhancedPrompts.set(rows);
          const existingName = this.profile()?.display_name?.trim();
          this.reviewForm.patchValue({
            display_name: existingName || this.keyword(),
            bio: rows
              .map((row) => row.enhanced.trim())
              .filter(Boolean)
              .join('\n\n')
              .slice(0, 500),
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
    const avatarUrl = this.selectedAvatarUrl()?.trim() || undefined;

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

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
          this.success.set('Profile created and saved.');
          this.step.set('done');
        },
        error: (err: unknown) =>
          this.error.set(this.readError(err, 'Could not save profile.')),
      });
  }

  startOver(): void {
    this.keywordForm.reset({ keyword: this.keyword() });
    this.promptsForm.reset({ prompt1: '', prompt2: '', prompt3: '' });
    this.reviewForm.reset({ display_name: '', bio: '' });
    this.enhancedPrompts.set([]);
    this.imageResults.set([]);
    this.selectedAvatarUrl.set(null);
    this.success.set('');
    this.error.set('');
    this.step.set('keyword');
  }

  private buildEnhanceInput(prompt: string): string {
    const keyword = this.keyword().trim();
    return [
      `Profile keyword: ${keyword}`,
      'Write a short profile bio line for a Junction shop owner.',
      `Prompt: ${prompt}`,
    ].join('\n');
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
