/**
 * Public Identity Platform web API key.
 * Same value as Render env GCP_IDENTITY_PLATFORM_API_KEY.
 * Safe to expose in the browser; restrict by HTTP referrer in Google Cloud Console.
 *
 * Fill this in to mint reCAPTCHA tokens without a Vercel env var or backend route.
 */
export const IDENTITY_PLATFORM_WEB_API_KEY = 'AIzaSyBAT_Xm3t_QEITallMdyDZ1_KaMApIqkwg';
