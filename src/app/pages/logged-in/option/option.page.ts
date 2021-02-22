import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from "../../../providers/event.service";
import { AccountService } from "../../../providers/logged-in/account.service";


@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  constructor(
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public accountService: AccountService,
  ) { }

  ngOnInit() {
  }

  /**
   * close popup
   */
  dismiss() {
    this.popoverCtrl.getTop().then(overlay => {
      if (overlay) {
        this.popoverCtrl.dismiss();
      }
    });
  }

  /**
   * Log Agent out of the app
   */
  logout() {
    this.authService.logout();
    this.dismiss();
  }

  translate() {

    const code = this.translateService.currentLang != 'ar' ? 'ar' : 'en';

    this.eventService.setLanguagePref$.next(code);

    if (this.authService.isLogin) {
      this.accountService.setLanguagePref(code).subscribe();
    }

    this.dismiss();
  }
}
