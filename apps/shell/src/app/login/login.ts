import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, from, switchMap } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { isPostGraceViewerPlan, PlanSummary } from '../core/auth.models';
import {
  FREE_TRIAL_DAYS,
  PLAN_CATALOG,
  PlanOption,
  PlanType,
  PlansService,
} from '../core/plans.service';
import { RecaptchaService } from '../core/recaptcha.service';
import { SessionService } from '../core/session.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly plansApi = inject(PlansService);
  private readonly recaptcha = inject(RecaptchaService);
  private readonly router = inject(Router);

  readonly step = signal<'details' | 'otp' | 'plans'>('details');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly sessionInfo = signal('');
  readonly plans = signal<PlanOption[]>(PLAN_CATALOG);
  readonly currentPlan = signal<PlanSummary | null>(null);
  readonly trialDays = FREE_TRIAL_DAYS;
  readonly plansModalOpen = signal(false);
  readonly acceptTerms = signal(false);

  readonly details = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.minLength(2)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    if (this.auth.authenticated$.value && this.auth.role) {
      void this.router.navigateByUrl(this.auth.homePath());
      return;
    }
    this.plansApi.list().subscribe({
      next: (plans) => this.plans.set(plans),
      error: () => this.plans.set(PLAN_CATALOG),
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.plansModalOpen()) {
      this.closePlansModal();
    }
  }

  openPlansModal(): void {
    this.plansModalOpen.set(true);
  }

  closePlansModal(): void {
    this.plansModalOpen.set(false);
  }

  onAcceptTermsChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.acceptTerms.set(checked);
  }

  canSendOtp(): boolean {
    return this.acceptTerms() && !this.busy();
  }

  sendOtp(): void {
    if (!this.acceptTerms()) {
      this.error.set('Please accept the Terms and Conditions to continue.');
      return;
    }
    if (this.details.invalid) {
      this.details.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    const formValue = this.details.getRawValue();
    const phoneNumber = `+91${formValue.phone_number}`;

    from(this.recaptcha.getToken())
      .pipe(
        switchMap((recaptchaToken) =>
          this.auth.requestOtp({
            display_name: formValue.display_name,
            phone_number: phoneNumber,
            recaptcha_token: recaptchaToken,
          }),
        ),
        finalize(() => this.busy.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.sessionInfo.set(response.session_info);
          this.step.set('otp');
        },
        error: (error: unknown) => this.error.set(this.readError(error, 'We could not send the OTP. Please try again.')),
      });
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    const phoneNumber = `+91${this.details.getRawValue().phone_number}`;
    this.auth
      .verifyOtp(this.otpForm.getRawValue().otp, phoneNumber, this.sessionInfo())
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (response) => {
          this.error.set('');
          const role = this.auth.role;
          if (role === 'admin') {
            void this.router.navigateByUrl('/admin');
            return;
          }

          // After Premium/trial + grace: you are a viewer (not an owner) → deactivated view.
          const postGrace = isPostGraceViewerPlan(response.plan);
          if (role === 'viewer' || postGrace) {
            if (this.session.user) {
              this.session.saveFromAuthUser({ ...this.session.user, role: 'viewer' }, 'viewer');
            }
            void this.router.navigateByUrl('/back-office/activate');
            return;
          }

          // Active owner — continue with plan selection, then back office.
          this.currentPlan.set(response.plan ?? null);
          this.step.set('plans');
        },
        error: (error: unknown) =>
          this.error.set(this.readError(error, 'That OTP is invalid or has expired. Please try again.')),
      });
  }

  choosePlan(planType: PlanType): void {
    if (planType === 'free_trial') {
      void this.router.navigateByUrl('/back-office');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.plansApi
      .select(planType)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/back-office'),
        error: (error: unknown) =>
          this.error.set(this.readError(error, 'Could not save your plan. Please try again.')),
      });
  }

  continueWithTrial(): void {
    void this.router.navigateByUrl('/back-office');
  }

  skipToApp(): void {
    void this.router.navigateByUrl('/back-office/plans');
  }

  editNumber(): void {
    this.otpForm.reset();
    this.step.set('details');
    this.error.set('');
  }

  productLimitLabel(plan: PlanOption): string {
    if (plan.profile_only || plan.max_products === 0) {
      return 'Profile only';
    }
    if (plan.max_products === null) {
      return 'More than 150 products';
    }
    if (plan.type === 'free_trial') {
      return `Up to ${plan.max_products} products · ${plan.duration_days ?? this.trialDays} days`;
    }
    return `Up to ${plan.max_products} products`;
  }

  selectablePlans(): PlanOption[] {
    return this.plans().filter((plan) => plan.type !== 'free_trial');
  }

  modalPlans(): PlanOption[] {
    return this.plans();
  }

  private readError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const detail = error.error?.detail;
      if (typeof detail === 'string' && detail.trim()) {
        return detail;
      }
    }
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }
}
