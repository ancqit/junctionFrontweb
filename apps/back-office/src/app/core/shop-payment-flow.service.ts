import { inject, Injectable } from '@angular/core';
import { Observable, from, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  PaymentsApi,
  ShopPayment,
  ShopPaymentCompleteResponse,
} from './payments.api';
import { RazorpayCheckoutService } from './razorpay-checkout.service';

/**
 * Shared plan / product-pack collection: pending payment → Razorpay Checkout → verify.
 * Falls back to `/complete` only when Razorpay env is missing on the server (local/dev).
 */
@Injectable({ providedIn: 'root' })
export class ShopPaymentFlowService {
  private readonly paymentsApi = inject(PaymentsApi);
  private readonly razorpay = inject(RazorpayCheckoutService);

  collect(payment: ShopPayment): Observable<ShopPaymentCompleteResponse> {
    if (!payment?.id) {
      return throwError(() => new Error('Missing payment id.'));
    }
    if (payment.status !== 'pending') {
      return throwError(() => new Error(`Payment is ${payment.status}.`));
    }

    return this.paymentsApi.checkout(payment.id).pipe(
      switchMap((session) =>
        from(this.razorpay.openCheckout(session)).pipe(
          switchMap((success) =>
            this.paymentsApi.verify(payment.id, {
              razorpay_order_id: success.razorpay_order_id,
              razorpay_payment_id: success.razorpay_payment_id,
              razorpay_signature: success.razorpay_signature,
            }),
          ),
        ),
      ),
      catchError((err: unknown) => {
        if (this.isRazorpayMissing(err)) {
          return this.paymentsApi.complete(payment.id, {
            payment_method: 'other',
            payment_reference: 'dev-without-razorpay',
          });
        }
        return throwError(() => err);
      }),
    );
  }

  private isRazorpayMissing(error: unknown): boolean {
    const status = (error as { status?: number })?.status;
    const detail = this.readDetail(error).toLowerCase();
    return (
      status === 503 ||
      detail.includes('razorpay is not configured')
    );
  }

  private readDetail(error: unknown): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    const message = (error as { message?: string })?.message;
    return typeof message === 'string' ? message : '';
  }
}
