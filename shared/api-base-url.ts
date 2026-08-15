/** Production backend (Render). Used by Capacitor APK and Electron when there is no Vercel /api proxy. */
export const JUNCTION_PRODUCTION_API_URL = 'https://junctionback.onrender.com';

/**
 * Capacitor virtual hostname — must match a domain in Firebase **Authorized domains**
 * so reCAPTCHA tokens pass GCP Identity Platform (not `localhost`).
 */
export const CAPACITOR_WEB_HOSTNAME = 'junction.website';

/** Production web hosts (Capacitor virtual host + Vercel deploy). */
export const JUNCTION_WEB_HOSTNAMES = [
  'junction.website',
  'www.junction.website',
  'junction-frontweb.vercel.app',
] as const;

export function isJunctionWebHostname(hostname: string): boolean {
  if (!hostname) {
    return false;
  }
  return (
    JUNCTION_WEB_HOSTNAMES.includes(hostname as (typeof JUNCTION_WEB_HOSTNAMES)[number]) ||
    hostname.endsWith('.vercel.app')
  );
}

function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const capacitor = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return capacitor?.isNativePlatform?.() === true;
}

/**
 * Resolves the API base URL for shell, back-office, and native bundles.
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
