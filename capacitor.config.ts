import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.studenthub.candidate',
  appName: 'SH Candidate',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '123188361193-od1ehqo4c35cle8mtplqetoenussu650.apps.googleusercontent.com',
      //123188361193-ijgbu581g8sp4qag6gt4nia3410160qk.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    SplashScreen: {
      "launchAutoHide": false,
      "showSpinner": false,
      "launchShowDuration": 30000,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#f24459",
      "splashFullScreen": true,
      "splashImmersive": true
    }
  }
};

export default config;
