// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serviceWorker: false,
  envName: 'krushn',
  googleAPIKey: 'AIzaSyBSM8o4WSIIRn-sNhn-PvO2s0ovZuLDAaw',
  marker: null,//'assets/images/car.svg',
  oneSignalAppId: 'c62352ca-2f6c-44a2-896c-84c2f17db9ac',
  oneSignalSafariAppId: '',
  mixpanelKey: 'ac62dbe81767f8871f754c7bdf6669d6',
  cloudinaryUrl: "https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596453482/dev/",
  permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/",
  apiEndpoint: 'http://localhost:8888/bawes/studenthub/candidate/web/index.php/v1',
  sentryDsn: 'https://f672e69e130f805ea58e12014bf31b0f@o70039.ingest.us.sentry.io/4511495398293504'
  //apiEndpoint: 'http://localhost/studenthub/candidate/web/index.php/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
