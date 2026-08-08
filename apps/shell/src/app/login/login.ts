import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly step = signal<'details' | 'otp'>('details');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly challengeId = signal('');
  readonly sessionInfo = signal('');
  readonly details = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.minLength(2)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    recaptcha_token: ['test-token'], // TODO: Integrate Google reCAPTCHA v3
  });
  readonly otpForm = this.fb.nonNullable.group({ otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });

  sendOtp(): void {
    if (this.details.invalid) { this.details.markAllAsTouched(); return; }
    this.busy.set(true); this.error.set('');
    const formValue = this.details.getRawValue();
    const payload = {
      ...formValue,
      phone_number: `+91${formValue.phone_number}`, // Prepend country code
    };
    this.auth.requestOtp(payload).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: (response) => { 
        this.challengeId.set(response.challengeId); 
        this.sessionInfo.set(response.session_info);
        this.step.set('otp');
      },
      error: () => this.error.set('We could not send the OTP. Check the local API and try again.'),
    });
  }
  verifyOtp(): void {
    if (this.otpForm.invalid) { this.otpForm.markAllAsTouched(); return; }
    this.busy.set(true); this.error.set('');
    const phoneNumber = `+91${this.details.getRawValue().phone_number}`;
    this.auth.verifyOtp(this.challengeId(), this.otpForm.getRawValue().otp, phoneNumber, this.sessionInfo()).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => void this.router.navigateByUrl('/back-office'),
      error: () => this.error.set('That OTP is invalid or has expired. Please try again.'),
    });
  }
  editNumber(): void { this.otpForm.reset(); this.step.set('details'); this.error.set(''); }
}
