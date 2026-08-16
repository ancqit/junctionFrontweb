import { PlayIntegrity } from '@capacitor-community/play-integrity';
import { isCapacitorNative } from '../../../../../shared/api-base-url';

/** Firebase / GCP project number (Identity Toolkit producerProjectNumber). */
const GCP_PROJECT_NUMBER = 551503664846;

const BASE64URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Encode bytes as Base64 URL-safe, no-wrap, no-padding
 * (Android: Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING).
 * Play Integrity rejects nonces that are not in this form (NONCE_IS_NOT_BASE64).
 */
export function bytesToBase64UrlNoWrap(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!;
    const b = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2]! : 0;
    const triple = (a << 16) | (b << 8) | c;

    out += BASE64URL_ALPHABET[(triple >> 18) & 63];
    out += BASE64URL_ALPHABET[(triple >> 12) & 63];
    if (i + 1 < bytes.length) {
      out += BASE64URL_ALPHABET[(triple >> 6) & 63];
    }
    if (i + 2 < bytes.length) {
      out += BASE64URL_ALPHABET[triple & 63];
    }
  }
  return out;
}

/**
 * Identity Platform Play Integrity nonce:
 * SHA-256(UTF-8 E.164 phone) → Base64 URL-safe no-wrap no-padding.
 */
export async function phoneIntegrityNonce(phoneNumber: string): Promise<string> {
  const phone = phoneNumber.trim();
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error('Phone must be E.164 (e.g. +9198XXXXXXXX) before Play Integrity.');
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(phone));
  const nonce = bytesToBase64UrlNoWrap(new Uint8Array(digest));
  // Play Integrity: 16–500 chars, base64url alphabet only.
  if (nonce.length < 16 || nonce.length > 500 || !/^[A-Za-z0-9_-]+$/.test(nonce)) {
    throw new Error('Play Integrity nonce is not a valid Base64 URL-safe no-wrap string.');
  }
  return nonce;
}

/**
 * Android-only: Play Integrity token for GCP sendVerificationCode.
 * Web must use reCAPTCHA — never call this from the browser.
 */
export async function requestPlayIntegrityForPhone(phoneNumber: string): Promise<string> {
  if (!isCapacitorNative()) {
    throw new Error('Play Integrity is only available in the Android APK, not on web.');
  }

  const nonce = await phoneIntegrityNonce(phoneNumber);
  try {
    const { token } = await PlayIntegrity.requestIntegrityToken({
      nonce,
      googleCloudProjectNumber: GCP_PROJECT_NUMBER,
    });

    if (!token?.trim()) {
      throw new Error('Play Integrity did not return a token');
    }

    return token.trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/NONCE_IS_NOT_BASE64|nonce/i.test(message)) {
      throw new Error(
        `Play Integrity nonce rejected (${message}). Expected Base64 URL-safe no-wrap SHA-256 of ${phoneNumber}.`,
      );
    }
    throw new Error(
      `Play Integrity failed (${message}). Confirm app SHA-256 is in Firebase, ` +
        `Play Integrity API is enabled, and you are on a real device (not emulator).`,
    );
  }
}
