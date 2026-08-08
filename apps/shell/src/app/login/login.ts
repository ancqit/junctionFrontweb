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
  readonly details = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    city: [{ value: 'Ranchi', disabled: true }],
    locality: [{ value: 'Main Road', disabled: true }],
  });
  readonly otpForm = this.fb.nonNullable.group({ otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });

  sendOtp(): void {
    if (this.details.invalid) { this.details.markAllAsTouched(); return; }
    this.busy.set(true); this.error.set('');
    this.auth.requestOtp(this.details.getRawValue()).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: ({ challengeId }) => { this.challengeId.set(challengeId); this.step.set('otp'); },
      error: () => this.error.set('We could not send the OTP. Check the local API and try again.'),
    });
  }
  verifyOtp(): void {
    if (this.otpForm.invalid) { this.otpForm.markAllAsTouched(); return; }
    this.busy.set(true); this.error.set('');
    this.auth.verifyOtp(this.challengeId(), this.otpForm.getRawValue().otp).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => void this.router.navigateByUrl('/back-office'),
      error: () => this.error.set('That OTP is invalid or has expired. Please try again.'),
    });
  }
  editNumber(): void { this.otpForm.reset(); this.step.set('details'); this.error.set(''); }
}
