import { PlayIntegrity } from '@capacitor-community/play-integrity';
import { isCapacitorNative } from '../../../../../shared/api-base-url';

/** Firebase / GCP project number (Identity Toolkit producerProjectNumber). */
const GCP_PROJECT_NUMBER = 551503664846;

async function phoneIntegrityNonce(phoneNumber: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(phoneNumber));
  const bytes = new Uint8Array(digest);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/**
 * Android Play Integrity token for GCP sendVerificationCode (replaces WebView reCAPTCHA).
 * Requires SHA-256 of debug/release keystore in Firebase + Play Integrity API enabled.
 */
export async function requestPlayIntegrityForPhone(phoneNumber: string): Promise<string> {
  if (!isCapacitorNative()) {
    throw new Error('Play Integrity is only available in the native app');
  }

  const nonce = await phoneIntegrityNonce(phoneNumber);
  const { token } = await PlayIntegrity.requestIntegrityToken({
    nonce,
    googleCloudProjectNumber: GCP_PROJECT_NUMBER,
  });

  if (!token) {
    throw new Error('Play Integrity did not return a token');
  }

  return token;
}
