/**
 * Same-origin helper for minting Identity Platform reCAPTCHA site keys.
 *
 * Set ONE of:
 * - Vercel env: GCP_IDENTITY_PLATFORM_API_KEY (same value as Render)
 * - Or rely on junctionBack GET /auth/recaptcha-params / identity-platform.config.ts
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ detail: 'Method not allowed' }));
    return;
  }

  const apiKey = process.env.GCP_IDENTITY_PLATFORM_API_KEY;
  if (!apiKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        detail:
          'GCP_IDENTITY_PLATFORM_API_KEY is not configured on Vercel. Add it in Vercel → Project Settings → Environment Variables (same value as Render), then redeploy.',
      }),
    );
    return;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=${encodeURIComponent(apiKey)}`,
    );
    const data = await response.json();
    if (!response.ok) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          detail: data?.error?.message || 'Failed to load reCAPTCHA params',
        }),
      );
      return;
    }

    if (!data.recaptchaSiteKey) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ detail: 'GCP did not return a reCAPTCHA site key' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ recaptcha_site_key: data.recaptchaSiteKey }));
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ detail: 'Unable to reach GCP Identity Platform' }));
  }
};
