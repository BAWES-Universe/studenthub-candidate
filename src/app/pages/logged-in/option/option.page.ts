import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
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
    public router: Router,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public accountService: AccountService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Option page');
  }

  /**
   * update job search status
   */
   updateJobSearchStatus() {

    const params = {
      job_search_status: this.authService.candidate_job_search_status == 1 ? 0 : 1
    };

    this.updating = true;

    this.accountService.updateJobSearchStatus(params).subscribe(async data => {

      this.updating = false;

      if (data.operation != 'success') {

        let alert = await this.alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: data.message,
          buttons: [this.translateService.transform('Okay')],
        });
        return alert.present();
      }

      this.authService.candidate_job_search_status = params.job_search_status;

      this.router.navigate(['/']);

      this.dismiss();

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

  async deleteProfile() {
    this.dismiss();
    let alert = await this.alertCtrl.create({
      header: this.translateService.transform('Delete Profile'),
      message: this.translateService.transform('Are you sure you want to delete your profile permanently.'),
      buttons: [
        {
          text: this.translateService.transform('No'),
          role: 'cancel'
        },
        {
          text: this.translateService.transform('Yes'),
          handler: async () => {
            this.accountService.removeProfile().subscribe(async data => {

              this.updating = false;

              if (data.operation != 'success') {

                let alert = await this.alertCtrl.create({
                  header: this.translateService.transform('Error'),
                  message: data.message,
                  buttons: [this.translateService.transform('Okay')],
                });
                return alert.present();
              }

              this.logout();

            }, () => {
              this.updating = false;
            });
          }
        }
      ],
    });
    return alert.present();
  }
}
