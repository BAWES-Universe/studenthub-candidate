# StudentHub-candidate

Frontend app for the Candidate portal

Bugs: 

- track button in arabic should on left 
- test onesignal implementation in android/ios
- deeplinking in android/ios

#app for first time

 -- update super class to `androidx.core.content.FileProvider` in FileProvider file (`io.github.pwlin.cordova.plugins.fileopener2` package)

 -- add below in info.plist

    <key>UIBackgroundModes</key>
         <array>
         <string>remote-notification</string>
         </array>
    
 -- sync app then open in xcode
   - change assets folder for splash screen and icons
   - App
        - <b>General Tab</b> 
            - change Display Name
            - change App category
            - change build version if already has any (build version for development and version is for live)
            - in framework/Liberaries Section: add OneSignal xcframework
        - <b>Signing & capabilities Tab</b>
            - select team in all debug and release tab
            - add capabilities: push notification and sign in with apple
        -<b>Info Tab</b>
            - add privacy - Location always and when in use usage... : with detail
   - Clear all issue and clear all build from product folder then run app on simulator or on live mobile for testing 
