import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides, ModalController, NavController, Platform} from '@ionic/angular';
import { Router } from "@angular/router";
import { PreLoad } from 'src/app/util/preLoad';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
// pages
import { RegisterPage } from '../register/register.page';
import { PasswordPage } from '../password/password.page';
import { ModalPopPage } from '../modal-pop/modal-pop.page';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
@PreLoad('EmailPage')
@PreLoad('PasswordPage')
@PreLoad('RegisterPage')
export class LandingPage implements OnInit {

  public slideOpts = {};
  public didInit: boolean = false;

  @ViewChild(IonSlides) ionSlides: IonSlides;

  constructor(
    public accountService: AccountService,
    public platform: Platform,
    public authService: AuthService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public auth: Auth0Service,
    public modalCtrl: ModalController,
    public route: Router
  ) {
    this.slideOpts = {
        initialSlide: 0,
        speed: 400
      };
  }

  async ngOnInit() {
    // this.analyticsService.page('Landing Page');
  }

  translate() {

    const code = this.translateService.currentLang != 'ar' ? 'ar' : 'en';

    this.eventService.setLanguagePref$.next(code);


    if (code == 'ar') {
      this.slideOpts = {
        initialSlide: 3,
        speed: 400
      };
    } else  {
      this.slideOpts = {
        initialSlide: 0,
        speed: 400
      };
    }

    if (this.authService.isLogin) {
      this.accountService.setLanguagePref(code).subscribe();
    }

    location.reload();
  }

  reload() {
    this.route.navigate(['/landing']);
  }

  /**
   * redirec to auth0
   */
  loginWithRedirect() {
    const url = null;
    // this.auth.loginWithRedirect({ redirect_uri: url })
  }

  /**
   * show register form popup
   */
  async registerPage() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ModalPopPage,
      componentProps: {
        activatedRoutePath: RegisterPage
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

  /**
   * show login form popup
   */
  async loginPage() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ModalPopPage,
      componentProps: {
        activatedRoutePath: PasswordPage
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

  /**
   * login by Apple API
   */
  loginByApple() {
    if (this.platform.is('ios') && this.platform.is('capacitor')) {
      this.authService.loginByApple();
    } else {
      this.authService.loginByAppleJs();
    }
  }

  loginWithAuth0() {
    return true;
  //   if (this.platform.is('ios') && this.platform.is('capacitor')) {
  //     this.loginWithRedirect();
  //   } else {
  //     this.auth
  //         .buildAuthorizeUrl()
  //         .pipe(mergeMap((url) => Browser.open({url, windowName: '_self'})))
  //         .subscribe();
  //   }
  }
}
