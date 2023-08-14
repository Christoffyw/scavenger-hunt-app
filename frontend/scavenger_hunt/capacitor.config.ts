import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scavenger_hunt',
  appName: 'scavenger_hunt',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
