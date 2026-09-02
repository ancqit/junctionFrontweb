import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentShopService } from './core/current-shop.service';
import { I18nService } from './core/i18n/i18n.service';
import { TranslatePipe } from './core/i18n/translate.pipe';
import { LogoutService } from './core/logout.service';
import { PlanAccessService } from './core/plan-access.service';
import { ShopLockService } from './core/shop-lock.service';
import { buildProfileCompleteness } from './core/profile-completeness';
import { ProfileApi } from './core/profile.api';
import { UserProfile } from './core/models';

@Component({
  selector: 'app-back-office',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly access = inject(PlanAccessService);
  readonly shopLock = inject(ShopLockService);
  readonly i18n = inject(I18nService);
  private readonly logoutService = inject(LogoutService);
  private readonly profileApi = inject(ProfileApi);
  private readonly currentShop = inject(CurrentShopService);
  private readonly fb = inject(FormBuilder);

  readonly profile = signal<UserProfile | null>(null);
  readonly profileModalOpen = signal(false);
  readonly menuOpen = signal(false);
  readonly saving = signal(false);
  readonly connectingDigiLocker = signal(false);
  readonly gstLoading = signal(false);
  readonly gstVerifying = signal(false);
  readonly gstCaptchaImage = signal<string | null>(null);
  readonly gstSessionId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');

  readonly profileForm = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.minLength(2)]],
    bio: [''],
    avatar_url: [''],
  });

  readonly gstForm = this.fb.nonNullable.group({
    gstin: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
    captcha: ['', [Validators.required, Validators.minLength(1)]],
  });

  readonly shop = this.currentShop.shop;

  readonly completeness = computed(() => {
    const profile = this.profile();
    const shop = this.shop();
    return buildProfileCompleteness({
      displayName: profile?.display_name,
      phoneNumber: profile?.phone_number,
      bio: profile?.bio,
      avatarUrl: profile?.avatar_url,
      digilockerVerified: profile?.digilocker_verified,
      gstVerified: profile?.gst_verified,
      shopName: shop?.name,
      shopCity: shop?.city,
      shopLocality: shop?.locality,
    });
  });

  readonly avatarInitials = computed(() => {
    const name = this.profile()?.display_name?.trim() || this.shop()?.name?.trim() || 'J';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  readonly storeTitle = computed(() => {
    this.i18n.lang();
    return (
      this.shop()?.name?.trim() ||
      this.profile()?.display_name?.trim() ||
      this.i18n.t('nav.yourShop')
    );
  });

  readonly storePlace = computed(() => {
    this.i18n.lang();
    const shop = this.shop();
    if (shop?.locality?.trim() && shop?.city?.trim()) {
      return `${shop.locality} · ${shop.city}`;
    }
    return shop?.city?.trim() || this.i18n.t('common.addShopDetails');
  });

  ngOnInit(): void {
    this.access.refresh().subscribe();
    this.reloadProfile();
    this.currentShop.ensureShop().subscribe({
      next: (shop) => {
        if (shop) {
          this.shopLock.syncActiveShopPlanLock().subscribe();
        }
      },
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.profileModalOpen()) {
      this.closeProfileModal();
    }
    if (this.menuOpen()) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  openProfileModal(): void {
    this.closeMenu();
    const profile = this.profile();
    this.profileForm.patchValue({
      display_name: profile?.display_name ?? '',
      bio: profile?.bio ?? '',
      avatar_url: profile?.avatar_url ?? '',
    });
    this.gstForm.patchValue({
      gstin: profile?.gstin ?? '',
      captcha: '',
    });
    this.error.set('');
    this.success.set('');
    this.profileModalOpen.set(true);
    this.reloadProfile();
    if (!profile?.gst_verified) {
      this.refreshGstCaptcha();
    }
  }

  closeProfileModal(): void {
    this.profileModalOpen.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const raw = this.profileForm.getRawValue();
    const payload = {
      display_name: raw.display_name.trim(),
      bio: raw.bio.trim() || null,
      avatar_url: raw.avatar_url.trim() || null,
    };
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .update(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.success.set(this.i18n.t('profileModal.saved'));
        },
        error: (err: unknown) => {
          const detail = (err as { error?: { detail?: string } })?.error?.detail;
          this.error.set(
            typeof detail === 'string' && detail.trim() ? detail : 'Could not save profile.',
          );
        },
      });
  }

  connectDigiLocker(): void {
    this.connectingDigiLocker.set(true);
    this.error.set('');
    this.profileApi
      .connectDigiLocker()
      .pipe(finalize(() => this.connectingDigiLocker.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.authorization_url) {
            window.location.href = res.authorization_url;
            return;
          }
          this.error.set(
            'DigiLocker is not configured on the server yet. Ask Junction to enable partner credentials.',
          );
        },
      });
  }

  refreshGstCaptcha(): void {
    this.gstLoading.set(true);
    this.error.set('');
    this.profileApi
      .gstCaptcha()
      .pipe(finalize(() => this.gstLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.gstSessionId.set(res.session_id);
          this.gstCaptchaImage.set(res.image);
          this.gstForm.patchValue({ captcha: '' });
        },
        error: (err: unknown) => {
          const detail = (err as { error?: { detail?: string } })?.error?.detail;
          this.error.set(
            typeof detail === 'string' && detail.trim()
              ? detail
              : 'Could not load GST captcha from the portal.',
          );
        },
      });
  }

  verifyGst(): void {
    if (this.gstForm.invalid) {
      this.gstForm.markAllAsTouched();
      return;
    }
    const sessionId = this.gstSessionId();
    if (!sessionId) {
      this.error.set('Refresh the GST captcha first.');
      return;
    }
    const raw = this.gstForm.getRawValue();
    this.gstVerifying.set(true);
    this.error.set('');
    this.success.set('');
    this.profileApi
      .verifyGst({
        session_id: sessionId,
        gstin: raw.gstin.trim().toUpperCase(),
        captcha: raw.captcha.trim(),
      })
      .pipe(finalize(() => this.gstVerifying.set(false)))
      .subscribe({
        next: (res) => {
          this.success.set(
            res.legal_name
              ? this.i18n.t('profileModal.gstVerifiedNamed', { name: res.legal_name })
              : this.i18n.t('profileModal.gstVerified'),
          );
          this.reloadProfile();
          this.gstCaptchaImage.set(null);
          this.gstSessionId.set(null);
        },
        error: (err: unknown) => {
          const detail = (err as { error?: { detail?: string } })?.error?.detail;
          this.error.set(
            typeof detail === 'string' && detail.trim()
              ? detail
              : 'GST verification failed. Check GSTIN/captcha and try again.',
          );
          this.refreshGstCaptcha();
        },
      });
  }

  logout(): void {
    this.logoutService.logout();
  }

  private reloadProfile(): void {
    this.profileApi.me().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => this.profile.set(null),
    });
  }
}
