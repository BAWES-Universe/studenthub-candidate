import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }

  /**
   * Update email address
   */
  async updateEmail() {

    const Cancel = this.translateService.transform('Cancel');
    const Submit = this.translateService.transform('Submit');
    const ChangeEmail = this.translateService.transform('Change Email');
    const NewEmail = this.translateService.transform('Enter New Email');

   const alert = await this._alertCtrl.create({
      header: ChangeEmail,
      inputs: [
        {
          name: 'newEmail',
          placeholder: NewEmail,
          type: 'email'
        }
      ],
      buttons: [
        {
          text: Cancel,
          role: 'cancel',
          handler: data => {
            return true;
          }
        },
        {
          text: Submit,
          handler: data => {
            return this.onUpdateEmailSubmit(data);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * On update email submit event
   * @param data
   */
  async onUpdateEmailSubmit(data) {

    const loader = await this._loadingCtrl.create();
    await loader.present();

    let action;

    if (this._authService.isLogin) {
      const candidate = new Candidate;
      candidate.email = data.newEmail;
      action = this.cvBuilder.updateEmail(candidate);
      
    } else {
      const params = {
        'unVerifiedToken': this.unVerifiedToken,
        'newEmail': data.newEmail
      };
      action = this._authService.updateEmail(params);
    }

    this.updateEmailSubscription = action.subscribe(async result => {

        loader.dismiss();

        if (result.operation == 'success') {

          this.email = data.newEmail;

          const toast = await this._toastCtrl.create({
            message: this.translateService.transform(result.message),
            duration: 3000,
          });
          await toast.present();   

          return true;

        } else if (result.operation == 'error-session-expired') {
          const toast = await this._toastCtrl.create({
            message: this.translateService.transform('Session expired, please log back in.'),
            duration: 3000
          });
          await toast.present();

          this.logout();

          return false;

        } else {

          const toast = await this._toastCtrl.create({
            message: this.translateService.errorMessage(result.message),
            duration: 3000
          });

          await toast.present();

          return false;
        }
      }, err => {
        loader.dismiss();
      });

    return false;
  }

  /**
   * Request to resend verification mail
   */
  resendVerificationEmail() {
    const ok = this.translateService.transform('ok');

    this.resendEmailSubscription = this._authService.resendVerificationEmail(this.email).subscribe(async res => {

      const alert = await this._alertCtrl.create({
        message: this.translateService.errorMessage(res.message),
        buttons: [ok]
      });
      await alert.present();

      if ( 
        res.operation != 'success' && 
        (
          res.errorCode == 1 || //if email already verified 
          res.errorCode == 3 // account not founnd 
        ) 
      ) {
        this.router.navigate(['view/home']);
      }
    });
  }

  /**
   * close page
   */
  dismiss() {
    this.navCtrl.back();
  }
}
