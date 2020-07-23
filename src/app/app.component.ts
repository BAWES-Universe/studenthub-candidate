import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
import { Plugins } from '@capacitor/core';
//services
import { EventService } from './providers/event.service';
import { AuthService } from './providers/auth.service';
import { TranslateLabelService } from './providers/translate-label.service';
import { LanguageService } from './providers/language.service';

const { App, StatusBar, SplashScreen } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public updatesAvailable: boolean = false;

  constructor(
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    public navCtrl: NavController,
    private platform: Platform,
    public _alertCtrl: AlertController,
    public languageService: LanguageService,
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public eventService: EventService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }

      this.setServiceWorker();
    });
  }

  /**
 * Using Ng2 Lifecycle hooks because view lifecycle events don't trigger for Bootstrapped MyApp Component
 */
  async ngOnInit() {

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
      let alert = await this._alertCtrl.create({
        header: 'No Internet Connection',
        subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
        buttons: ['Dismiss']
      });
      alert.present();

      this.navCtrl.navigateForward(['/no-internet']);
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogin$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/']);
    });

    // On Logout Event, set root to Login Page
    this.eventService.userLogout$.subscribe((logoutReason) => {
      // Set root to Login Page
      this.navCtrl.navigateRoot(['/landing']);

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
        console.log('Invalid Access');
      }
    });
  }

  /**
   * Change app language
   * @param language
   */
  translateTo(language) {

    this.translateService.use(language.code).subscribe();

    this.authService.setLanguagePref(language);

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
}
