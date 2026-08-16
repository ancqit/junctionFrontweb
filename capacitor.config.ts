import type { CapacitorConfig } from '@capacitor/cli';
import { CAPACITOR_WEB_HOSTNAME } from './shared/api-base-url';

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
    // Virtual hostname for reCAPTCHA — must be in Firebase Authorized domains.
    hostname: CAPACITOR_WEB_HOSTNAME,
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'junctionback.onrender.com',
      'junction.website',
      'www.junction.website',
      'junction-frontweb.vercel.app',
      'www.google.com',
      'www.gstatic.com',
      'www.recaptcha.net',
      'identitytoolkit.googleapis.com',
    ],
  },
};

export default config;
