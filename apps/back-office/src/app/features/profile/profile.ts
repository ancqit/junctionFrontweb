import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from '../../core/current-shop.service';
import { ImageSearchResult, UserProfile } from '../../core/models';
import { ProfileApi } from '../../core/profile.api';
import { QueriesApi } from '../../core/queries.api';

export type ProfileStep = 'view' | 'compose' | 'edit';

const BIO_SEPARATOR = '\n\n';
const MAX_AVATAR_OPTIONS = 10;

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit {
  private readonly profileApi = inject(ProfileApi);
  private readonly queriesApi = inject(QueriesApi);
  private readonly currentShop = inject(CurrentShopService);
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
  readonly imageError = signal('');
  readonly uploadingAvatar = signal(false);

  readonly promptsForm = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.maxLength(100)]],
    prompt1: ['', [Validators.required, Validators.maxLength(500)]],
    prompt2: ['', [Validators.maxLength(500)]],
    prompt3: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.currentShop.ensureShop().subscribe();
    this.reloadProfile();
  }

  reloadProfile(): void {
    this.loading.set(true);
    this.error.set('');
    this.profileApi
      .me()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.selectedAvatarUrl.set(profile.avatar_url ?? null);
          if (profile.bio?.trim()) {
            this.step.set('view');
          } else {
            this.resetToCompose(profile);
          }
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load profile.')),
      });
  }

  openEdit(): void {
    const profile = this.profile();
    if (profile) {
      this.patchPromptsFromBio(profile);
      this.selectedAvatarUrl.set(profile.avatar_url ?? null);
    }
    this.imageResults.set([]);
    this.error.set('');
    this.success.set('');
    this.step.set('edit');
  }

  cancelEdit(): void {
    const profile = this.profile();
    if (profile?.bio?.trim()) {
      this.imageResults.set([]);
      this.error.set('');
      this.success.set('');
      this.step.set('view');
      return;
    }
    this.resetToCompose(profile);
  }

  saveProfile(): void {
    this.persistProfile('view', 'Profile saved.');
  }

  updateProfile(): void {
    this.persistProfile('view', 'Profile updated.');
  }

  deleteProfile(): void {
    if (!confirm('Delete your shop profile bio? You can create it again.')) {
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .update({ bio: null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.resetToCompose(profile);
          this.success.set('Profile deleted.');
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not delete profile.')),
      });
  }

  loadAvatarOptions(): void {
    const query =
      this.promptsForm.controls.prompt1.value.trim() ||
      this.promptsForm.controls.display_name.value.trim();
    if (!query) {
      this.imageError.set('Enter a shop name or first prompt to search images.');
      return;
    }
    this.imageError.set('');
    this.searchingImages.set(true);
    this.queriesApi
      .searchImages(query, 1, MAX_AVATAR_OPTIONS)
      .pipe(finalize(() => this.searchingImages.set(false)))
      .subscribe({
        next: (response) => this.imageResults.set(response.images.slice(0, MAX_AVATAR_OPTIONS)),
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

  openDeviceAvatarPicker(input: HTMLInputElement): void {
    input.click();
  }

  onDeviceAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.imageError.set('Choose a JPG, PNG, WEBP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.imageError.set('Image must be 5 MB or smaller.');
      return;
    }
    this.uploadingAvatar.set(true);
    this.imageError.set('');
    this.profileApi
      .uploadAvatar(file)
      .pipe(finalize(() => this.uploadingAvatar.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.selectedAvatarUrl.set(profile.avatar_url ?? null);
          this.success.set('Photo uploaded.');
        },
        error: (err: unknown) =>
          this.imageError.set(this.readError(err, 'Could not upload photo from device.')),
      });
  }

  savedParagraphs(): string[] {
    const bio = this.profile()?.bio;
    if (!bio?.trim()) {
      return [];
    }
    return bio.split(BIO_SEPARATOR).map((value) => value.trim()).filter(Boolean);
  }

  shopNameLabel(): string {
    return this.profile()?.display_name?.trim() || this.defaultShopName() || 'Your shop';
  }

  avatarInitials(): string {
    const name = this.shopNameLabel();
    const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'S';
  }

  paragraphsPreview(): string[] {
    const raw = this.promptsForm.getRawValue();
    const built = buildBioFromPrompts(raw.prompt1, raw.prompt2, raw.prompt3);
    return built ? built.split(BIO_SEPARATOR).filter(Boolean) : [];
  }

  hasParagraphPreview(): boolean {
    return this.paragraphsPreview().length > 0;
  }

  private persistProfile(targetStep: ProfileStep, successMessage: string): void {
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
          this.selectedAvatarUrl.set(profile.avatar_url ?? null);
          this.imageResults.set([]);
          this.success.set(successMessage);
          this.step.set(targetStep);
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not save profile.')),
      });
  }

  private resetToCompose(profile: UserProfile | null): void {
    this.promptsForm.patchValue({
      display_name: profile?.display_name?.trim() || this.defaultShopName(),
      prompt1: '',
      prompt2: '',
      prompt3: '',
    });
    this.imageResults.set([]);
    this.selectedAvatarUrl.set(profile?.avatar_url ?? null);
    this.step.set('compose');
  }

  private defaultShopName(): string {
    return this.currentShop.shop()?.name?.trim() || this.profile()?.display_name?.trim() || '';
  }

  private patchPromptsFromBio(profile: UserProfile): void {
    const [prompt1, prompt2, prompt3] = parseBioParagraphs(profile.bio);
    this.promptsForm.patchValue({
      display_name: profile.display_name?.trim() || this.defaultShopName(),
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
