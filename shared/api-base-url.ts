/** Production backend (Render). Used by Capacitor APK and Electron when there is no Vercel /api proxy. */
export const JUNCTION_PRODUCTION_API_URL = 'https://junctionback.onrender.com';

/**
 * Capacitor virtual hostname — must match a domain authorized in Firebase / reCAPTCHA
 * (same as the production web app). Do not use `localhost` or GCP returns
 * `CAPTCHA_CHECK_FAILED: Hostname match not found`.
 */
export const CAPACITOR_WEB_HOSTNAME = 'junction-frontweb.vercel.app';

function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const capacitor = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return capacitor?.isNativePlatform?.() === true;
}

/**
 * Resolves the API base URL for shell, back-office, and native bundles.
 * - Capacitor APK: direct Render URL (virtual hostname is not a real API host).
 * - Web on Vercel: same-origin `/api` (rewritten to Render).
 * - Local Angular dev (4200/4201): `http://localhost:8000`.
 * - Electron `file://`: direct Render URL.
 */
export function resolveApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return JUNCTION_PRODUCTION_API_URL;
  }

  if (isCapacitorNative()) {
    return JUNCTION_PRODUCTION_API_URL;
  }

  const { protocol, hostname, port } = window.location;

  if (protocol === 'file:') {
    return JUNCTION_PRODUCTION_API_URL;
  }

  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAngularDev = isLocalHost && (port === '4200' || port === '4201');

  if (isAngularDev) {
    return 'http://localhost:8000';
  }

  return '/api';
}

/** True when running inside Capacitor APK or Electron production bundle (not web/Vercel). */
export function isNativeBundle(): boolean {
  if (isCapacitorNative()) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  const { protocol, hostname, port } = window.location;
  if (protocol === 'file:') {
    return true;
  }

  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAngularDev = isLocalHost && (port === '4200' || port === '4201');
  return isLocalHost && !isAngularDev;
}

export { isCapacitorNative };
