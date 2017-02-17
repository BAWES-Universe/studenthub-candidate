import { Component, OnInit, NgZone } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/start-pages/login/login';
import { NavigationPage } from '../pages/logged-in/navigation/navigation';

import { AuthService } from '../providers/auth.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage;

  constructor(
      private _platform: Platform,
      private _events: Events,
      private _auth: AuthService,
      private _zone: NgZone
  ) {
    this._platform.ready().then(() => {
        // Native functions
        if (this._platform.is('cordova') && this._platform.is('mobile')) {
            StatusBar.styleDefault();
            Splashscreen.hide();
        }

        // Figure out which page to load on app start [Based on Auth]
        if(this._auth.isLoggedIn){
            this.rootPage = NavigationPage;
        }else{
            this.rootPage = LoginPage;
        }
    });
  }

  /**
   * Using Ng2 Lifecycle hooks because view lifecycle events don't trigger for Bootstrapped MyApp Component
   */
  ngOnInit(){
      // On Login Event, set root to Internal app page
      this._events.subscribe('user:login', (userEventData) => {
        this._zone.run(() => {
          this.rootPage = NavigationPage;
        });
      });

      // On Logout Event, set root to Login Page
      this._events.subscribe('user:logout', (logoutReason) => {
        // Set root to Login Page
        this.rootPage = LoginPage;

        // Show Message explaining logout reason if there's one set
        if(logoutReason){
          console.log(logoutReason);
        }

      });
  }
}
