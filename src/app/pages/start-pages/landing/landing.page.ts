import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PreLoad } from 'src/app/util/preLoad';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


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
    public navCtrl: NavController
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

  loginPage() {
    this.navCtrl.navigateForward(['email']);
  }
}
