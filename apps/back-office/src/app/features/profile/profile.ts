import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ImageSearchResult, UserProfile } from '../../core/models';
import { ProfileApi } from '../../core/profile.api';
import { QueriesApi } from '../../core/queries.api';

export type ProfileStep = 'compose' | 'done' | 'manage';

const BIO_SEPARATOR = '\n\n';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit {
  private readonly profileApi = inject(ProfileApi);
  private readonly queriesApi = inject(QueriesApi);
  private readonly fb = inject(FormBuilder);

  readonly step = signal<ProfileStep>('compose');
  readonly profile = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly searchingImages = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly imageResults = signal<ImageSearchResult[]>([]);
  readonly selectedAvatarUrl = signal<string | null>(null);

  readonly promptsForm = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.maxLength(100)]],
    prompt1: ['', [Validators.required, Validators.maxLength(500)]],
    prompt2: ['', [Validators.maxLength(500)]],
    prompt3: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.reloadProfile(true);
  }

  reloadProfile(openManageIfBio = false): void {
    this.loading.set(true);
    this.error.set('');
    this.profileApi
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.selectedAvatarUrl.set(profile.avatar_url ?? null);
          if (openManageIfBio && profile.bio?.trim()) {
            this.patchPromptsFromBio(profile);
            this.step.set('manage');
          } else {
            this.promptsForm.patchValue({
              display_name: profile.display_name?.trim() || '',
            });
            this.step.set('compose');
          }
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load profile.')),
      });
  }

  saveProfile(targetStep: ProfileStep = 'done'): void {
    if (this.promptsForm.invalid) {
      this.promptsForm.markAllAsTouched();
      return;
    }

    const raw = this.promptsForm.getRawValue();
    const displayName = raw.display_name.trim();
    const bio = buildBioFromPrompts(raw.prompt1, raw.prompt2, raw.prompt3);
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
          this.patchPromptsFromBio(profile);
          this.success.set(targetStep === 'manage' ? 'Profile updated.' : 'Profile saved.');
          this.step.set(targetStep);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not save profile.')),
      });
  }

  updateProfile(): void {
    this.saveProfile('manage');
  }

  openManage(): void {
    const profile = this.profile();
    if (profile) {
      this.patchPromptsFromBio(profile);
    }
    this.error.set('');
    this.success.set('');
    this.step.set('manage');
  }

  deleteBio(): void {
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .update({ bio: null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.promptsForm.patchValue({ prompt1: '', prompt2: '', prompt3: '' });
          this.success.set('Bio deleted.');
          this.step.set('compose');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not delete bio.')),
      });
  }

  startOver(): void {
    this.promptsForm.reset({
      display_name: this.profile()?.display_name?.trim() || '',
      prompt1: '',
      prompt2: '',
      prompt3: '',
    });
    this.imageResults.set([]);
    this.selectedAvatarUrl.set(this.profile()?.avatar_url ?? null);
    this.success.set('');
    this.error.set('');
    this.step.set('compose');
  }

  loadAvatarOptions(): void {
    const query =
      this.promptsForm.controls.prompt1.value.trim() ||
      this.promptsForm.controls.display_name.value.trim();
    if (!query) {
      return;
    }
    this.searchingImages.set(true);
    this.queriesApi
      .searchImages(query, 1, 10)
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

  paragraphsPreview(): string[] {
    const raw = this.promptsForm.getRawValue();
    const built = buildBioFromPrompts(raw.prompt1, raw.prompt2, raw.prompt3);
    return built ? built.split(BIO_SEPARATOR).filter(Boolean) : [];
  }

  hasParagraphPreview(): boolean {
    return this.paragraphsPreview().length > 0;
  }

  private patchPromptsFromBio(profile: UserProfile): void {
    const [prompt1, prompt2, prompt3] = parseBioParagraphs(profile.bio);
    this.promptsForm.patchValue({
      display_name: profile.display_name?.trim() || '',
      prompt1,
      prompt2,
      prompt3,
    });
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}

function parseBioParagraphs(bio: string | null | undefined): [string, string, string] {
  const parts = (bio ?? '')
    .split(BIO_SEPARATOR)
    .map((value) => value.trim())
    .filter(Boolean);
  return [parts[0] ?? '', parts[1] ?? '', parts[2] ?? ''];
}

function buildBioFromPrompts(prompt1: string, prompt2: string, prompt3: string): string {
  return [prompt1, prompt2, prompt3]
    .map((value) => asParagraph(value))
    .filter(Boolean)
    .join(BIO_SEPARATOR)
    .slice(0, 500);
}

function asParagraph(value: string): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    return '';
  }
  const capped = trimmed[0].toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capped) ? capped : `${capped}.`;
}
