import {Component, OnInit, ApplicationRef, OnDestroy, Inject, NgZone} from '@angular/core';
import { Platform, NavController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { URLOpenListenerEvent } from '@capacitor/app';
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

const { App, StatusBar, SplashScreen, Storage } = Plugins;

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

  public invitationInterval;

  constructor(
    public zone: NgZone,
    public updates: SwUpdate,
    public oneSignal: OneSignal,
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
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
          // Example url: https://beerswift.app/tabs/tab2
          // slug = /tabs/tab2
         
          // If no match, do nothing - let regular routing
          // logic take over

          //if (event.url?.startsWith(callbackUri)) {
            // If the URL is an authentication callback URL..
            if (
              event.url.includes('state=') &&
              (event.url.includes('error=') || event.url.includes('code='))
            ) {
              // Call handleRedirectCallback and close the browser
              this.auth
                .handleRedirectCallback(event.url)
                //.pipe(mergeMap(() => Browser.close()))
                .subscribe((result) => {
                });
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
      this.oneSignal.provideUserConsent(false);
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

      this.setServiceWorker();
      
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
    });

    if (this.platform.is('capacitor') && this.platform.is('mobile')) {
      this._initOneSignal();

    // only when notification api available

    } else if(window && window.Notification) {
      this._includeOneSignalJs();
    }

    if(this.authService.isLogin) {
      this.setInvitationSubscription();
    }
  }

  /**
   * Using Ng2 Lifecycle hooks because view lifecycle events don't trigger for Bootstrapped MyApp Component
   */
  async ngOnDestroy() {
    if (this.invitationInterval) {
      clearInterval(this.invitationInterval);
    }
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

    this.eventService.errorStorage$.subscribe(() => {
      this.navCtrl.navigateRoot(['/app-error']);
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogin$.subscribe(data => {
      this.loadCandidateProfile();
      
      this.setInvitationSubscription();

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

      if (this.oneSignal) {
        this.oneSignal.setSubscription(userEventData['setSubscription']);

        Storage.set({
          key: 'oneSignal',
          value: JSON.stringify(userEventData)
        }).catch(r => {
          this.eventService.errorStorage$.next();
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

        this.oneSignal.getPermissionSubscriptionState().then(data => {
          if (data.subscriptionStatus.subscribed) {
            this.oneSignal.deleteTags(['name', 'email', 'candidate_id']);
          }
        });
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

        if (this.oneSignal) {
          this.oneSignal.setSubscription(data.setSubscription);

          //this.oneSignal.enableVibrate(data.enableVibrate);
          //this.oneSignal.enableSound(data.enableSound);

          this.oneSignal.sendTags({
            'candidate_id': this.authService.id + '',
            'name': this.authService.name,
            'email': this.authService.email
          });
        }
      }).catch(r => {
        this.eventService.errorStorage$.next();
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
      this.eventService.errorStorage$.next();
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
      this.eventService.errorStorage$.next();
    });
  }

  /**
   * check oneSignal subscription status for browser
   */
  async checkOneSignalStatus() {

    if (this.platform.is('capacitor') && this.platform.is('mobile')) {

      this.oneSignal.getPermissionSubscriptionState().then(state => {
        this.authService.showOneSignalPrompt = !state.subscriptionStatus.subscribed;
      });

      this.oneSignal.addSubscriptionObserver().subscribe(state => {
        if (state) {
          // !state.from.subscribed &&
          if (state.to.subscribed) {
            this.authService.showOneSignalPrompt = false;
            // Subscribed for OneSignal push notifications!
            // get player ID
            // state.to.userId
          } else {
            this.authService.showOneSignalPrompt = true;
          }

         // console.log('Push Subscription state changed: ' + JSON.stringify(state));
        }
      });

    } else if (window && window.OneSignal && window.Notification) {

      const OneSignal = window.OneSignal || [];

      OneSignal.isPushNotificationsEnabled(isEnabled => {

        if (isEnabled) {

          // Automatically subscribe user if deleted cookies and browser shows "Allow"

          OneSignal.getUserId().then(userId => {

            // remove old user tag if any

            if (userId) {

              const tags = [
                'candidate_uuid',
                'name',
                'email'
              ];

              OneSignal.deleteTags(tags);
            }

            // if (!userId) {

            OneSignal.setSubscription(true);
            OneSignal.registerForPushNotifications();

            // send user tag, to target based on tags

            const tags = {
              'candidate_id': this.authService.id + '',
              'name': this.authService.name,
              'email': this.authService.email
            }; 

            OneSignal.sendTags(tags);
             
            // }
          });
        } else {
          this.authService.showOneSignalPrompt = true;
        }
      });

      // Occurs when the user's subscription changes to a new value.

      OneSignal.on('subscriptionChange', isSubscribed => {
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

    this.oneSignal.startInit(environment.oneSignalAppId, '32997776097');

    //  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    // this.oneSignal.setSubscription(true);

    // oneSignal.handleNotificationReceived().subscribe(() => {
    // // do something when notification is received
    // });

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // When a Notification is Opened
      if (data.notification.groupedNotifications) {
        // Notification Grouped [on Android]
        const firstNotificationData = data.notification.groupedNotifications[0].additionalData;
        //this.eventService.notificationGrouped$.next(firstNotificationData);
      } else if (data.notification.payload) {
        // A single notification clicked
        const notificationData = data.notification.payload.additionalData;
        //this.eventService.notificationSingle$.next(notificationData);
      }
    });

    //this.setOneSignalSubscription();
    this.oneSignalActionBasedOnStatus();

    this.oneSignal.provideUserConsent(true);
    
    this.oneSignal.endInit();

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

    // service worker watcher
    if (!this.platform.is('capacitor') && window.location.hostname != 'localhost') {

      if ('serviceWorker' in navigator && environment.serviceWorker) {

        navigator.serviceWorker.register('./ngsw-worker.js');

        // Allow the app to stabilize first, before starting polling for updates with `interval()`.
        const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
        const updateInterval$ = interval(60 * 1000);// every minute 
        const updateIntervalOnceAppIsStable$ = concat(appIsStable$, updateInterval$);

        updateIntervalOnceAppIsStable$.subscribe(() => {
          this.updates.checkForUpdate().then((e) => {
          });
        });

        this.updates.available.subscribe((e) => {
          this.updatesAvailable = true;
        });

        this.updates.activated.subscribe((e) => {
          this.updatesAvailable = false;
        }, reason => {
          console.error('service worker update activation failed', reason);
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

  setInvitationSubscription() {
    this.loadInvitations();

    this.invitationInterval = setInterval(() => {
      if (this.authService.isLogin && navigator.onLine) {
        this.loadInvitations();
      }
    }, 1000 * 30); // every 30 second
  }

  /**
   * load invitations for request
   */
  loadInvitations() {

    this.invitationService.count().subscribe((count: any) => {
      const total = parseInt(count);
      if (this.authService.invitationCount != total) {
        this.eventService.requestUpdated$.next();
      }
      this.authService.invitationCount = total;
    });
  }
}

