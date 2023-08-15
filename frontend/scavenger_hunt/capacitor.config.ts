import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'me.christopherw.scavengerhunt',
  appName: 'Scavenger Hunt',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
