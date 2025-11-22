import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.liftgrowthrive.app',
  appName: 'Lift Grow Thrive',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
