import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

/** Matches junctionBack GET /terms-and-conditions. */
export interface TermsAndConditions {
  title: string;
  version: string;
  content: string;
  updated_at: string;
}

const FALLBACK_TERMS: TermsAndConditions = {
  title: 'Terms and Conditions',
  version: '1.0',
  content:
    'Welcome to Junction. By using our platform you agree to these terms.\n\n' +
    '1. Account — You are responsible for activity on your account and keeping your phone number secure.\n' +
    '2. Plans — Free trial, Starter, Growth, and Premium plans have the limits shown in the Plans section.\n' +
    '3. Shops & data — You own the shop and product data you enter.\n' +
    '4. Acceptable use — No abuse, spam, or attempts to disrupt the service.\n' +
    '5. Changes — We may update these terms; continued use after changes means acceptance.\n' +
    '6. Contact — Reach support through the app for billing or account issues.',
  updated_at: new Date().toISOString(),
};

@Injectable({ providedIn: 'root' })
export class TermsService {
  private readonly api = inject(ApiService);

  get(): Observable<TermsAndConditions> {
    return this.api.get<TermsAndConditions>('/terms-and-conditions', undefined, 'none').pipe(
      catchError(() => of(FALLBACK_TERMS)),
    );
  }
}
