import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
//models
import { Store } from 'src/app/models/store';
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

  public updating = false;

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
   * update job search status
   */
   updateJobSearchStatus() {

    const params = {
      job_search_status: this.authService.candidate_job_search_status == 1 ? 0 : 1
    };

    this.updating = true;

    this.authService.candidate_job_search_status = params.job_search_status;

    this.accountService.updateJobSearchStatus(params).subscribe(data => {

      this.updating = false;

      if (data.operation != 'success') {
        this.authService.candidate_job_search_status = !params.job_search_status; // back to old status
      }
    }, () => {
      this.updating = false;
    });
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
