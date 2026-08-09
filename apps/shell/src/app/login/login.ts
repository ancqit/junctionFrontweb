import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, from, switchMap } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { RecaptchaService } from '../core/recaptcha.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly recaptcha = inject(RecaptchaService);
  private readonly router = inject(Router);

  readonly step = signal<'details' | 'otp'>('details');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly sessionInfo = signal('');

  readonly details = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.minLength(2)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

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
        next: () => void this.router.navigateByUrl('/back-office'),
        error: (error: unknown) =>
          this.error.set(this.readError(error, 'That OTP is invalid or has expired. Please try again.')),
      });
  }

  editNumber(): void {
    this.otpForm.reset();
    this.step.set('details');
    this.error.set('');
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
