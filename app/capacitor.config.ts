import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.affichagescolaire.app',
  appName: 'Affichage Scolaire',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
