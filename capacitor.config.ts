import type { CapacitorConfig } from '@capacitor/cli';

/** Must match Firebase / reCAPTCHA authorized domain (see shared/api-base-url.ts). */
const CAPACITOR_WEB_HOSTNAME = 'junction-frontweb.vercel.app';

const config: CapacitorConfig = {
  appId: 'today.junction.app',
  appName: 'Junction',
  webDir: 'dist/app-bundle',
  bundledWebRuntime: false,
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    StatusBar: {
      overlaysWebView: false,
    },
  },
  android: {
    adjustMarginsForEdgeToEdge: 'auto',
  },
  server: {
    // Virtual hostname for reCAPTCHA / Firebase (must be in authorized domains).
    hostname: CAPACITOR_WEB_HOSTNAME,
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'junctionback.onrender.com',
      'junction-frontweb.vercel.app',
      'www.google.com',
      'www.gstatic.com',
      'www.recaptcha.net',
      'identitytoolkit.googleapis.com',
    ],
  },
};
export default config;
