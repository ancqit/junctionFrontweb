import { Injectable } from '@angular/core';
import { RazorpayCheckoutSession } from './payments.api';

export interface RazorpaySuccessPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessPayload) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (response: unknown) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

@Injectable({ providedIn: 'root' })
export class RazorpayCheckoutService {
  private scriptPromise: Promise<void> | null = null;

  loadScript(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Razorpay Checkout needs a browser.'));
    }
    if (window.Razorpay) {
      return Promise.resolve();
    }
    if (this.scriptPromise) {
      return this.scriptPromise;
    }
    this.scriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay.')), {
          once: true,
        });
        return;
      }
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.scriptPromise = null;
        reject(new Error('Failed to load Razorpay Checkout.'));
      };
      document.body.appendChild(script);
    });
    return this.scriptPromise;
  }

  /**
   * Open Razorpay Checkout for a backend checkout session.
   * Resolves on success; rejects on dismiss or payment failure.
   */
  async openCheckout(session: RazorpayCheckoutSession): Promise<RazorpaySuccessPayload> {
    await this.loadScript();
    if (!window.Razorpay) {
      throw new Error('Razorpay Checkout is unavailable.');
    }

    return new Promise<RazorpaySuccessPayload>((resolve, reject) => {
      let settled = false;
      const rzp = new window.Razorpay!({
        key: session.key_id,
        amount: session.amount_paise,
        currency: session.currency || 'INR',
        name: 'Junction',
        description: session.description,
        order_id: session.order_id,
        prefill: {
          name: session.name || undefined,
          email: session.email || undefined,
          contact: session.contact || undefined,
        },
        theme: { color: '#0f766e' },
        handler: (response) => {
          settled = true;
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            if (!settled) {
              reject(new Error('Payment cancelled.'));
            }
          },
        },
      });
      rzp.on('payment.failed', (response: unknown) => {
        settled = true;
        const detail =
          (response as { error?: { description?: string } })?.error?.description ||
          'Payment failed.';
        reject(new Error(detail));
      });
      rzp.open();
    });
  }
}
