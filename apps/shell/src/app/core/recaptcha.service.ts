import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from './api.config';
import { IDENTITY_PLATFORM_WEB_API_KEY } from './identity-platform.config';

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi;
  }
}

interface GrecaptchaApi {
  ready(callback: () => void): void;
  render(
    container: HTMLElement,
    parameters: {
      sitekey: string;
      size: 'invisible';
      callback: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
    },
  ): number;
  execute(widgetId: number): void;
  reset(widgetId?: number): void;
}

interface RecaptchaParamsResponse {
  recaptcha_site_key: string;
}

interface IdentityToolkitRecaptchaParams {
  recaptchaSiteKey?: string;
}

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private scriptPromise?: Promise<void>;
  private siteKeyPromise?: Promise<string>;
  private widgetId?: number;
  private container?: HTMLDivElement;
  private pending?: {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  };

  async getToken(): Promise<string> {
    const siteKey = await this.getSiteKey();
    await this.loadScript();
    return this.execute(siteKey);
  }

  private getSiteKey(): Promise<string> {
    this.siteKeyPromise ??= this.resolveSiteKey();
    return this.siteKeyPromise;
  }

  private async resolveSiteKey(): Promise<string> {
    // 1) Prefer the public web API key (same as Render GCP_IDENTITY_PLATFORM_API_KEY).
    const apiKey = IDENTITY_PLATFORM_WEB_API_KEY.trim();
    if (apiKey) {
      const params = await firstValueFrom(
        this.http.get<IdentityToolkitRecaptchaParams>(
          `https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=${encodeURIComponent(apiKey)}`,
        ),
      );
      if (params.recaptchaSiteKey) {
        return params.recaptchaSiteKey;
      }
    }

    // 2) Same-origin API (Vercel serverless or proxied junctionBack).
    try {
      const fromApi = await firstValueFrom(
        this.http.get<RecaptchaParamsResponse>(
          `${this.config.baseUrl.replace(/\/$/, '')}/auth/recaptcha-params`,
        ),
      );
      if (fromApi.recaptcha_site_key) {
        return fromApi.recaptcha_site_key;
      }
    } catch {
      // continue
    }

    throw new Error(
      'reCAPTCHA is not configured. Set IDENTITY_PLATFORM_WEB_API_KEY in identity-platform.config.ts.',
    );
  }

  private loadScript(): Promise<void> {
    this.scriptPromise ??= new Promise<void>((resolve, reject) => {
      if (window.grecaptcha) {
        resolve();
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>('script[data-junction-recaptcha]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA')), {
          once: true,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset['junctionRecaptcha'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
      document.head.appendChild(script);
    });
    return this.scriptPromise;
  }

  private execute(siteKey: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha) {
        reject(new Error('reCAPTCHA failed to initialize'));
        return;
      }

      this.pending = { resolve, reject };

      grecaptcha.ready(() => {
        try {
          if (this.widgetId === undefined) {
            this.container = document.createElement('div');
            this.container.style.display = 'none';
            document.body.appendChild(this.container);
            this.widgetId = grecaptcha.render(this.container, {
              sitekey: siteKey,
              size: 'invisible',
              callback: (token: string) => {
                this.pending?.resolve(token);
                this.pending = undefined;
              },
              'error-callback': () => {
                this.pending?.reject(new Error('reCAPTCHA verification failed'));
                this.pending = undefined;
              },
              'expired-callback': () => {
                this.pending?.reject(new Error('reCAPTCHA expired. Please try again.'));
                this.pending = undefined;
              },
            });
          } else {
            grecaptcha.reset(this.widgetId);
          }
          grecaptcha.execute(this.widgetId);
        } catch (error) {
          this.pending = undefined;
          reject(error instanceof Error ? error : new Error('Unable to start reCAPTCHA'));
        }
      });
    });
  }
}
