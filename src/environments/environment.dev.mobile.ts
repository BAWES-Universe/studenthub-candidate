// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serviceWorker: false,
  envName: 'dev',
  oneSignalAppId: 'fe766231-6156-4537-8037-84e3fe1be5da',
  oneSignalSafariAppId: 'web.onesignal.auto.4b99c5db-a7c9-461a-8333-facb0838095d',
  cloudinaryUrl: "https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face/v1596453482/",
  permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/",
  apiEndpoint: 'https://student.api.dev.studenthub.co/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
