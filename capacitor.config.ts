import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kolmox.app',
  appName: 'Kolmox',
  webDir: 'dist',
  server: {
    url: 'https://kolmox.com.bo',
    cleartext: true
  }
};
//capacitor run android --livereload --external
//npx cap sync android
export default config;
