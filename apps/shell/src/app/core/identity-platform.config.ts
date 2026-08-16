/**
 * Public Identity Platform web API key.
 * Same value as Render env GCP_IDENTITY_PLATFORM_API_KEY.
 * Safe to expose in the browser; restrict by HTTP referrer in Google Cloud Console.
 *
 * Prefer GET /auth/recaptcha-params from junctionBack (or Vercel /api/auth/recaptcha-params).
 * This key is a last-resort fallback when those are unreachable.
 */
export const IDENTITY_PLATFORM_WEB_API_KEY = 'AIzaSyBAT_Xm3t_QEITallMdyDZ1_KaMApIqkwg';
