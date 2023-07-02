import {Component, OnInit, ApplicationRef, OnDestroy, Inject, NgZone} from '@angular/core';
import { Platform, NavController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { filter, first, map } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
import { Plugins } from '@capacitor/core';
import OneSignal from 'onesignal-cordova-plugin';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
//services
import { EventService } from './providers/event.service';
import { AuthService } from './providers/auth.service';
import { TranslateLabelService } from './providers/translate-label.service';
import { LanguageService } from './providers/language.service';
import {KuwaitiNationalPage} from "./pages/logged-in/kuwaiti-national/kuwaiti-national.page";
import {AccountService} from "./providers/logged-in/account.service";
import {Invitation} from "./models/invitation";
import {InvitationService} from "./providers/logged-in/invitation.service";
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Preferences as Storage } from '@capacitor/preferences';

const { SplashScreen} = Plugins;

import { mergeMap } from 'rxjs/operators';
import { Browser } from '@capacitor/browser';
import { App, URLOpenListenerEvent } from '@capacitor/app';

declare var window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public updatesAvailable: boolean = false;

  public notificationScriptLoaded: boolean = false;
  public candidate: any;

  public invitations: Invitation[] = [];

  public callbackUri = `co.studenthub.candidate://bawes.us.auth0.com/capacitor/co.studenthub.candidate/callback`;

  constructor(
    public zone: NgZone,
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    public navCtrl: NavController,
    public router: Router,
    private platform: Platform,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public languageService: LanguageService,
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public invitationService: InvitationService,
    public auth: Auth0Service,
    @Inject(DOCUMENT) public document: Document,
  ) {
  }

  initializeApp() {
    // Use Capacitor's App plugin to subscribe to the `appUrlOpen` event
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      this.zone.run(() => {
        //if (url?.startsWith(this.callbackUri)) {
          // If the URL is an authentication callback URL..
          if (
            event.url.includes('state=') &&
            (event.url.includes('error=') || event.url.includes('code='))
          ) {
            // Call handleRedirectCallback and close the browser
            this.auth
              .handleRedirectCallback(event.url)
              //.pipe(mergeMap(() => Browser.close()))
              .subscribe();
          } else {
            const slug = event.url.split(".co").pop();

            if (slug) {
              this.router.navigateByUrl(slug);
            }
            
            //Browser.close();
          }
        //}
      });
    });

    //to fix : https://www.pivotaltracker.com/story/show/172176267

    if(this.platform.is('ios')) {
      // OneSignal.provideUserConsent(false);
    }

    window.onpopstate = e => {

      if (window['history-back-from'] == 'onDidDismiss') {
        window['history-back-from'] = null;
        return false;
      }

      this.popoverCtrl.getTop().then(overlay => {

        if (overlay) {
          this.popoverCtrl.dismiss({
            'from': 'native-back-btn'
          });
        }

        this.modalCtrl.getTop().then(overlay => {

          if (overlay) {
            this.modalCtrl.dismiss({
              'from': 'native-back-btn'
            });
          }
        });
      });
    };

    this.platform.ready().then(() => {

      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }

      /*if (!this.authService.currentLocation) { 
        this.authService.locate().subscribe(res => {
          
          this.authService.currentLocation = res; 

          this.eventService.locationUpdated$.next(res);
        });
      }*/

      this.setServiceWorker();

      // use hook after platform dom ready
      GoogleAuth.initialize({
        clientId: '123188361193-od1ehqo4c35cle8mtplqetoenussu650.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });

      /**
       * when user comming back from auth0
       */
      this.auth.isAuthenticated$.subscribe(isAuthenticated => {

        if(!isAuthenticated || this.authService.isLogin) return null;

        //this.auth.idTokenClaims$.subscribe(r => {
        this.auth.getAccessTokenSilently().subscribe(r => {
          this.authService.useTokenForAuth(r).then();
        });
      });

      if (this.platform.is('capacitor') && this.platform.is('mobile')) {
        this._initOneSignal();

        // only when notification api available

      } else if(window && window.Notification) {
        this._includeOneSignalJs();
      }
    });
  }

  /**
   * Using Ng2 Lifecycle hooks because view lifecycle events don't trigger for Bootstrapped MyApp Component
   */
  async ngOnDestroy() {

  }

  async ngOnInit() {
    this.initializeApp();

    this.eventService.kuwaitiNationl$.subscribe(candidate => {
      this.candidate = candidate;
      this.kuwaitiNationalUpdate();
    });

    /**
     * Save user language preference after login
     */
    this.eventService.setLanguagePref$.subscribe(language_pref => {

      /**
       * changing status on `side` property change
       * https://github.com/ionic-team/ionic/blob/master/core/src/components/menu/menu.tsx
       *
       if (language_pref == 'ar') {
        this.menuRTL.side = 'end';//changing english to arabic
      } else {
        this.menuLTR.side = 'end';//changing arabic to english
      }*/

      this.languageService.listToTranslate().subscribe(languages => {

        for (const element of languages) {
          if (element.code == language_pref) {

            // change language

            this.translateTo(element);

            break;
          }
        }
      });
    });

    this.eventService.error404$.subscribe(data => {
      this.navCtrl.navigateForward(['not-found']);
    });

    this.eventService.error500$.subscribe(data => {
      this.navCtrl.navigateForward(['server-error']);
    });

    // Check for network connection
    this.eventService.internetOffline$.subscribe(async () => {
      let alert = await this.alertCtrl.create({
        header: 'No Internet Connection',
        subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
        buttons: ['Dismiss']
      });
      alert.present();

      this.navCtrl.navigateForward(['/no-internet']);
    });


    this.eventService.error500$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/server-error']);
    });

    this.eventService.error404$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/not-found']);
    });

    this.eventService.errorStorage$.subscribe((e) => {
      console.error(e);
      this.navCtrl.navigateRoot(['/app-error']);
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogin$.subscribe(data => {
      this.loadCandidateProfile();

      if(data['isProfileCompleted']) {
        this.navCtrl.navigateRoot(['/']);
      } else {
        this.navCtrl.navigateRoot(['complete-profile']);
      }

      this.oneSignalActionBasedOnStatus();
    });

    /**
     * Update one signal setting to manage subscription for mobile
     * notification
     */
    this.eventService.setOneSignalSubscription$.subscribe(userEventData => {

      if (OneSignal) {
        // OneSignal.setSubscription(true);

        Storage.set({
          key: 'oneSignal',
          value: JSON.stringify(userEventData)
        }).catch(r => {
          this.eventService.errorStorage$.next(r);
        });
      }
    });

    this.eventService.setOneSignal$.subscribe(() => {
      this.setOneSignalSubscription();
    });

    // On Logout Event, set root to Login Page
    this.eventService.userLogout$.subscribe((logoutReason) => {
      // Set root to Login Page
      this.navCtrl.navigateRoot(['/landing']);

      this.auth.isAuthenticated$.subscribe(isAuthenticated => {
        if(isAuthenticated) {
          this.auth.logout({ returnTo: document.location.origin });
        }
      })

      // unsubscribe from oneSignal

      if (this.platform.is('capacitor') && this.platform.is('mobile')) {

        // OneSignal.getPermissionSubscriptionState().then(data => {
        //   if (data.subscriptionStatus.subscribed) {
        //     OneSignal.deleteTags(['name', 'email', 'candidate_id']);
        //   }
        // });
      }
      else if (window && window.Notification && window.OneSignal)
      {
        const OneSignal = window.OneSignal;

        OneSignal.isPushNotificationsEnabled(isEnabled => {

          if (isEnabled) {

            // Delete user tags if subscribed

            OneSignal.getUserId().then(userId => {

              if (userId) {

                const tags = [
                  'candidate_id',
                  'name',
                  'email'
                ];

                OneSignal.deleteTags(tags);
              }
            });
          }
        });
      }

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
      }
    });
  }

  /**
   * set oneSignal subscription for browser
   */
  async setOneSignalSubscription() {

    if (this.platform.is('capacitor') && this.platform.is('mobile')) {

      Storage.get({ key: 'oneSignal' }).then(ret => {

        let data = JSON.parse(ret.value);

        // set default value if not set
        if (!data) {
          data = {
            setSubscription: true,
            enableVibrate: true,
            enableSound: true
          };
        }

        //OneSignal.setSubscription(true);

        //OneSignal.enableVibrate(data.enableVibrate);
        //OneSignal.enableSound(data.enableSound);

        OneSignal.setAppId(environment.oneSignalAppId);

        OneSignal.sendTags({
          'candidate_id': this.authService.id + '',
          'name': this.authService.name,
          'email': this.authService.email
        });

      }).catch(r => {
        this.eventService.errorStorage$.next(r);
      });
    }
    else if(window && window.Notification && window.OneSignal)
    {
      const OneSignal = window.OneSignal || [];

      OneSignal.setSubscription(true);
      OneSignal.registerForPushNotifications();

      // send user tag, to target based on tags

      const tags = {
        'candidate_id': this.authService.id + '',
        'name': this.authService.name,
        'email': this.authService.email
      };

      OneSignal.sendTags(tags);
    }

    this.authService.showOneSignalPrompt = false;

    Storage.set({
      'key': 'oneSignalStatus',
      'value': '1'
    }).catch(r => {
      this.eventService.errorStorage$.next(r);
    });
  }

  /**
   * check oneSignal subscription status to show prompt in conversation list page
   */
  async oneSignalActionBasedOnStatus() {

    Storage.get({ 'key': 'oneSignalStatus' }).then(data => {

      if (data.value === '1') { // already accepted
        this.setOneSignalSubscription();
      } else { // not sure
        this.checkOneSignalStatus();
      }
      // if status == 2, ignore - user not want notifications
    }).catch(r => {
      this.eventService.errorStorage$.next(r);
    });
  }

  /**
   * check oneSignal subscription status for browser
   */
  async checkOneSignalStatus() {

    if (this.platform.is('capacitor') && this.platform.is('mobile')) {

      // OneSignal.getPermissionSubscriptionState().then(state => {
      //   this.authService.showOneSignalPrompt = !state.subscriptionStatus.subscribed;
      // });
      //
      // OneSignal.addSubscriptionObserver().subscribe(state => {
      //   if (state) {
      //     // !state.from.subscribed &&
      //     if (state.to.subscribed) {
      //       this.authService.showOneSignalPrompt = false;
      //       // Subscribed for OneSignal push notifications!
      //       // get player ID
      //       // state.to.userId
      //     } else {
      //       this.authService.showOneSignalPrompt = true;
      //     }
      //
      //     // console.log('Push Subscription state changed: ' + JSON.stringify(state));
      //   }
      // });
      //todo: check onesignal on new app install + after login tags + after logout tags + on permission denied
      //+ on permission grant + send test notification + send order notif

      //as we not have send tags

      this.authService.showOneSignalPrompt = true;

    } else if (window && window.OneSignal && window.Notification) {

      const OneSignalw = window.OneSignal || [];

      OneSignalw.isPushNotificationsEnabled(isEnabled => {

        if (isEnabled) {

          // Automatically subscribe user if deleted cookies and browser shows "Allow"

          OneSignalw.getUserId().then(userId => {

            // remove old user tag if any

            if (userId) {

              const tags = [
                'candidate_uuid',
                'name',
                'email'
              ];

              OneSignalw.deleteTags(tags);
            }

            // if (!userId) {

            OneSignalw.setSubscription(true);
            OneSignalw.registerForPushNotifications();

            // send user tag, to target based on tags

            const tags = {
              'candidate_id': this.authService.id + '',
              'name': this.authService.name,
              'email': this.authService.email
            };

            OneSignalw.sendTags(tags);

            // }
          });
        } else {
          this.authService.showOneSignalPrompt = true;
        }
      });

      // Occurs when the user's subscription changes to a new value.

      OneSignalw.on('subscriptionChange', isSubscribed => {
        this.authService.showOneSignalPrompt = !isSubscribed;
      });
    }
  }

  /**
   * Include One signal to use stripe element in browser
   */
  async _includeOneSignalJs() {

    if (this.platform.is('capacitor') || window.location.hostname == 'localhost' || !window.Notification) {
      return null; // only for browser
    }

    /**
     * https://sentry.io/organizations/pogi/issues/1843000885/?project=5339282&referrer=slack
     * Cannot read property 'pushNotification' of undefined
     */

    const agent = window.navigator.userAgent.toLowerCase();

    if(this.platform.is('ios') && agent.indexOf('safari') > -1 && (!window.safari || !window.safari.pushNotification)) {
      return null; // ios browser not supporting push notification
    }

    // if already loaded, just update tags

    if (window.OneSignal) {
      return this.oneSignalActionBasedOnStatus();
    }

    // if already initialized

    if (this.notificationScriptLoaded) {
      return null;
    }

    this.notificationScriptLoaded = true;

    // load script and call callback to initialize

    const callback = _ => {

      const wOneSignal = window.OneSignal || [];

      wOneSignal.push(_ => {

        // initialize only on first time script load

        wOneSignal.init({
          appId: environment.oneSignalAppId,
          safari_web_id: environment.oneSignalSafariAppId,
          autoRegister: false,
          httpPermissionRequest: {
            enable: false
          },
          promptOptions: {
            customlink: {
              enabled: true
            }
          }
        });

        this.oneSignalActionBasedOnStatus();
      });
    };

    this.loadScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', callback);
  }

  /**
   * Subscribe to oneSignal notification api for capacitor app
   */
  async _initOneSignal() {

    // to get notification when app not running in background
    // this.autostart.enable();

    OneSignal.setAppId(environment.oneSignalAppId);

    //  OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification);
    // OneSignal.setSubscription(true);

    // oneSignal.handleNotificationReceived().subscribe(() => {
    // // do something when notification is received
    // });

    // OneSignal.handleNotificationOpened().subscribe((data) => {
    //   // When a Notification is Opened
    //   if (data.notification.groupedNotifications) {
    //     // Notification Grouped [on Android]
    //     const firstNotificationData = data.notification.groupedNotifications[0].additionalData;
    //     //this.eventService.notificationGrouped$.next(firstNotificationData);
    //   } else if (data.notification.payload) {
    //     // A single notification clicked
    //     const notificationData = data.notification.payload.additionalData;
    //     //this.eventService.notificationSingle$.next(notificationData);
    //   }
    // });

    OneSignal.addSubscriptionObserver(state => {

      if (state) {
        // !state.from.subscribed &&
        if (state.to.isSubscribed) {
          // this.authService.showOneSignalPrompt = false;
          // Subscribed for OneSignal push notifications!
          // get player ID
          // state.to.userId

        } else {
          this.authService.showOneSignalPrompt = true;
        }

        // console.log('Push Subscription state changed: ' + JSON.stringify(state));
      }
    });

    //this.setOneSignalSubscription();
    this.oneSignalActionBasedOnStatus();

    // OneSignal.provideUserConsent(true);

    // OneSignal.endInit();

    // OneSignal.getIds().then(data => {
    //   // this gives you back the new userId and pushToken associated with the device. Helpful.
    // });
  }

  /**
   * Load javascripts dynamically
   * @param url
   * @param callback
   */
  async loadScript(url: string, callback = null) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;

    if (callback) {
      script.addEventListener('load', callback);
    }

    body.appendChild(script);
  }

  /**
   * Change app language
   * @param language
   */
  translateTo(language) {

    this.translateService.use(language.code).subscribe();

    this.authService.setLanguagePref(language.code);

    if (language.code == 'ar') {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    } else {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
    }
  }

  /**
   * keep checking for service worker update
   */
  setServiceWorker() {

    if (!this.platform.is('capacitor') && window.location.hostname != 'localhost') {
       
      if ('serviceWorker' in navigator && environment.serviceWorker) {
        
        // Allow the app to stabilize first, before starting polling for updates with `interval()`.
        const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
        const updateInterval$ = interval(24 * 60 * 60 * 1000);// 24 hour
        const updateIntervalOnceAppIsStable$ = concat(appIsStable$, updateInterval$);

        updateIntervalOnceAppIsStable$.subscribe(() => {
          this.updates.checkForUpdate().then((e) => {
            console.log('checking for update...');
          });
        });

        const updatesAvailable = this.updates.versionUpdates.pipe(
          filter((evt): evt is VersionReadyEvent => {
            return evt.type === 'VERSION_READY';
          }),
          map(evt => ({
            type: 'UPDATE_AVAILABLE',
            current: evt.currentVersion,
            available: evt.latestVersion,
          })));
   
        updatesAvailable.subscribe(() => {
          this.updatesAvailable = true;
        });
        
      }
    }
  }

  /**
   * When user select refresh on udpate available prompt
   */
  onUpdateAlertRefresh() {

    if (!this.updatesAvailable) {
      return this.updatesAvailable = false;
    }

    try {
      this.updates.activateUpdate().then(() => {
      });
    } catch {
    }

    window.location.reload();
  }

  /**
   * When user select close on udpate available prompt
   */
  onUpdateAlertClose() {
    this.updatesAvailable = false;
  }

  /**
   * update kuwaiti national option of user
   */
  async kuwaitiNationalUpdate() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: KuwaitiNationalPage,
      cssClass: 'kuwaiti-national-popup',
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  async loadCandidateProfile() {
    this.accountService.profile().subscribe(res => {
      this.candidate = res;
    });
  }
}

