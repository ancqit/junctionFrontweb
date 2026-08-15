import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'today.junction.app',
  appName: 'Junction',
  webDir: 'dist/app-bundle',
  bundledWebRuntime: false,
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'junctionback.onrender.com',
      'www.google.com',
      'www.gstatic.com',
      'www.recaptcha.net',
      'identitytoolkit.googleapis.com',
    ],
  },
};

export default config;
