import { isPlatform } from '@ionic/angular';
import config from '../../capacitor.config';

export const domain = 'bawes.us.auth0.com';
export const clientId = (isPlatform('ios') || isPlatform('android')) ? 
    'iyNUKYtUrbL7QjbfRLrZnwLcwy6njH7b' :'sDIOpy1be7Y59ocKoXxHVL5euFNdJN3e';
const { appId } = config;

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain;
const iosOrAndroid = isPlatform('ios') || isPlatform('android');
const click = isPlatform('ios') || isPlatform('android');

export const callbackUri = iosOrAndroid
    ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
    : null;
