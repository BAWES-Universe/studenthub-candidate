# StudentHub-candidate

Frontend app for the Candidate portal

Bugs: 

- track button in arabic should on left 
- test onesignal implementation in android/ios
- deeplinking in android/ios

#app for first time

 -- update super class to `androidx.core.content.FileProvider` in FileProvider file (`io.github.pwlin.cordova.plugins.fileopener2` package)

 -- add below in info.plist

    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
        <string>Required to clock in and clock out time</string>
        <key>NSLocationWhenInUseUsageDescription</key>
        <string>Required to clock in and clock out time</string>
        <key>NSCameraUsageDescription</key>
        <string>Candidate App needs permission to Upload/Record introduction video to build profile for job purpose</string>
        <key>NSPhotoLibraryUsageDescription</key>
        <string>Candidate App needs permission to access photos on your device to show on profile for job purpose</string>
        <key>NSPhotoLibraryAddUsageDescription</key>
        <string>Candidate App needs permission to access photos on your device to show on profile for job purpose</string>
        <key>NSMicrophoneUsageDescription</key>
        <string>Candidate App needs permission to access mic to record voice for introduction video</string>
        <key>NSUserTrackingUsageDescription</key>
        <string>App would like to access IDFA for tracking purpose</string>
        
 -- sync app then open in xcode
   - change assets folder for splash screen and icons
   - App
        - <b>General Tab</b> 
            - change Display Name
            - change App category
            - change build version if already has any (build version for development and version is for live)
            - in framework/libraries Section: add OneSignal xcframework
            - <b>Signing & capabilities Tab</b>
            - select team in all debug and release tab
            - add capabilities: push notification and sign in with apple
        -<b>Info Tab</b>
            - add privacy - Location always and when in use usage... : with detail
   - Clear all issue and clear all build from product folder then run app on simulator or on live mobile for testing 

# To Generate key

`keytool -genkey -v -keystore android-release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000`

## Password 

Bawes@231!

## List key 

`keytool -list -v -keystore D:\xampp\htdocs\plugn-dashboard-ionic\android-release.keystore`

65:61:CD:01:87:BB:88:54:19:73:4B:F7:8A:55:38:92:D5:01:33:E1:C3:E9:96:18:27:58:D8:8D:20:5A:F0:F6
ionic integrations enable cordova : in case to add config.xml file

cmd  : ionic capacitor sync --configuration=production-mobile
https://ionicframework.com/docs/v5/react/your-first-app/deploying-mobile

### Genrate ngsw.json

`./node_modules/.bin/ngsw-config ./www/<project-name> ./src/ngsw-config.json [/base/href]`

### Sample for localhost

`./node_modules/.bin/ngsw-config ./www ./src/ngsw-config.json http://localhost/studenthub-candidate/www/`
