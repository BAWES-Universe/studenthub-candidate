import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PreLoad } from 'src/app/util/preLoad';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
//pages
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

  constructor(
    public accountService: AccountService,
    public authService: AuthService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    //public navCtrl: NavController,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  translate() {

    const code = this.translateService.currentLang != 'ar' ? 'ar' : 'en';
 
    this.eventService.setLanguagePref$.next(code);

    if (this.authService.isLogin) {
      this.accountService.setLanguagePref(code).subscribe();
    }
  }

  visitWebsite() {
    window.location.href = 'https://studenthub.co';
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
}
