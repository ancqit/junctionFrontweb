import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { PlanSummary, PlanType } from './models';
import { ProductBucket } from './product-bucket.api';

/** junctionBack `ShopPayment` (`/payments`). */
export type ShopPaymentKind = 'plan' | 'product_pack';
export type ShopPaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
export type ShopPaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';

export interface ShopPayment {
  id: string;
  store_id: string;
  owner_user_id: string;
  kind: ShopPaymentKind;
  status: ShopPaymentStatus;
  amount_inr: number;
  currency: string;
  plan_type?: PlanType | null;
  packs?: number | null;
  slots?: number | null;
  description: string;
  payment_method?: ShopPaymentMethod | null;
  payment_reference?: string | null;
  provider?: string | null;
  provider_order_id?: string | null;
  provider_payment_id?: string | null;
  created_at: string;
  updated_at: string;
  paid_at?: string | null;
  fulfilled_at?: string | null;
}

export interface ShopPaymentCompleteResponse {
  payment: ShopPayment;
  plan?: PlanSummary | null;
  /** junctionBack field name (`ShopPaymentCompleteResponse.product_bucket`). */
  product_bucket?: ProductBucket | null;
  message?: string;
}

/** junctionBack `RazorpayCheckoutResponse`. */
export interface RazorpayCheckoutSession {
  payment_id: string;
  provider: string;
  key_id: string;
  order_id: string;
  amount_inr: number;
  amount_paise: number;
  currency: string;
  description: string;
  store_id: string;
  kind: ShopPaymentKind;
  plan_type?: PlanType | null;
  packs?: number | null;
  name?: string | null;
  email?: string | null;
  contact?: string | null;
}

export interface RazorpayVerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Read bucket from a payment-complete payload (junctionBack uses `product_bucket`). */
export function paymentCompleteBucket(
  response: ShopPaymentCompleteResponse,
): ProductBucket | null | undefined {
  return response.product_bucket;
}

/**
 * Shop plan / pack payments — capacity activates after Razorpay verify
 * (`POST /payments/{id}/verify`) or webhook fulfillment.
 */
@Injectable({ providedIn: 'root' })
export class PaymentsApi {
  private readonly api = inject(BackOfficeApiService);

  list(storeId?: string): Observable<ShopPayment[]> {
    const params = storeId?.trim() ? { store_id: storeId.trim() } : undefined;
    return this.api.get<ShopPayment[]>('/payments', params, 'user');
  }

  get(paymentId: string): Observable<ShopPayment> {
    return this.api.get<ShopPayment>(`/payments/${paymentId}`, undefined, 'user');
  }

  checkout(paymentId: string): Observable<RazorpayCheckoutSession> {
    return this.api.post<RazorpayCheckoutSession>(
      `/payments/${paymentId}/checkout`,
      {},
      'user',
    );
  }

  verify(paymentId: string, body: RazorpayVerifyBody): Observable<ShopPaymentCompleteResponse> {
    return this.api.post<ShopPaymentCompleteResponse>(
      `/payments/${paymentId}/verify`,
      body,
      'user',
    );
  }

  /** Admin / local-dev fallback when Razorpay is not configured. */
  complete(
    paymentId: string,
    body: { payment_method?: ShopPaymentMethod; payment_reference?: string } = {},
  ): Observable<ShopPaymentCompleteResponse> {
    return this.api.post<ShopPaymentCompleteResponse>(
      `/payments/${paymentId}/complete`,
      body,
      'user',
    );
  }

  fail(paymentId: string, reason?: string): Observable<ShopPayment> {
    return this.api.post<ShopPayment>(
      `/payments/${paymentId}/fail`,
      { reason: reason ?? null },
      'user',
    );
  }
}
