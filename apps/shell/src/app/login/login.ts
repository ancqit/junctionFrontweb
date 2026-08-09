import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, from, switchMap } from 'rxjs';
import { AuthService } from '../core/auth.service';
import {
  FREE_TRIAL_DAYS,
  PLAN_CATALOG,
  PlanCatalogItem,
  PlanId,
  PlansService,
} from '../core/plans.service';
import { RecaptchaService } from '../core/recaptcha.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly plansApi = inject(PlansService);
  private readonly recaptcha = inject(RecaptchaService);
  private readonly router = inject(Router);

  readonly step = signal<'details' | 'otp' | 'plans'>('details');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly sessionInfo = signal('');
  readonly plans = signal<PlanCatalogItem[]>(PLAN_CATALOG);
  readonly trialDays = FREE_TRIAL_DAYS;

  readonly details = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.minLength(2)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    this.plansApi.list().subscribe({
      next: (plans) => this.plans.set(plans),
      error: () => this.plans.set(PLAN_CATALOG),
    });
  }

  sendOtp(): void {
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
        next: () => {
          this.error.set('');
          this.step.set('plans');
        },
        error: (error: unknown) =>
          this.error.set(this.readError(error, 'That OTP is invalid or has expired. Please try again.')),
      });
  }

  startTrial(): void {
    this.busy.set(true);
    this.error.set('');
    this.plansApi
      .startTrial()
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/back-office'),
        error: (error: unknown) =>
          this.error.set(this.readError(error, 'Could not start the free trial. You can choose a plan instead.')),
      });
  }

  choosePlan(planId: PlanId): void {
    this.busy.set(true);
    this.error.set('');
    this.plansApi
      .select(planId)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/back-office'),
        error: (error: unknown) =>
          this.error.set(this.readError(error, 'Could not save your plan. Please try again.')),
      });
  }

  skipToApp(): void {
    void this.router.navigateByUrl('/back-office/plans');
  }

  editNumber(): void {
    this.otpForm.reset();
    this.step.set('details');
    this.error.set('');
  }

  productLimitLabel(plan: PlanCatalogItem): string {
    if (plan.product_limit === null) {
      return 'More than 150 products';
    }
    if (plan.product_limit === 0) {
      return 'Profile only';
    }
    return `Up to ${plan.product_limit} products`;
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
