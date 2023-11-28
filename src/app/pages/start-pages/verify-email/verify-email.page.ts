import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Plugins } from '@capacitor/core';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
import { Preferences as Storage } from '@capacitor/preferences';
import { AnalyticsService } from 'src/app/providers/analytics.service';

declare let grecaptcha;

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit, OnDestroy {

  public email: string;

  public code: string;

  public timer: number;

  public timerInterval;

  public unVerifiedToken: string;

  public isVerified = false;

  public loader = true;

  public emailVerifiedSubscription;

  public timeIntervalToVerify = 5 * 1000;

  public timeElapsedToVerify = 0;

  public timeoutToVerify = 5 * 60 * 1000; // 5 min in milliseconds

  public isAlreadyVerifiedSubscription: Subscription;
  public updateEmailSubscription: Subscription;
  public verifyEmailSubscription: Subscription;
  public resendEmailSubscription: Subscription;
  public runTimer = false;
  public errorMsg = null;

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Verify Email Page');

    if (window.history.state.newUser) {
      this.runTimer = true ;
    }
  }

  ngOnDestroy() {
    if (!!this.isAlreadyVerifiedSubscription) {
      this.isAlreadyVerifiedSubscription.unsubscribe();
    }

    if (!!this.updateEmailSubscription) {
      this.updateEmailSubscription.unsubscribe();
    }

    if (!!this.verifyEmailSubscription) {
      this.verifyEmailSubscription.unsubscribe();
    }

    if (!!this.resendEmailSubscription) {
      this.resendEmailSubscription.unsubscribe();
    }

    if (!!this.timerInterval) {
      this.clearTimer();
    }

    this.clearVerifySubscription();
  }

  setTimer() {

    if (!this.runTimer) {
      return false;
    }

    this.timer = 60;

    if (this.timerInterval) {
      return null;
    }

    this.timerInterval = setInterval(() => {

      this.timer--;

      if (!this.timer || this.timer < 1) {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    clearInterval(this.timerInterval);
    this.timer = null;
    this.timerInterval = null;
  }
  
  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Verify Email Page'
    });
 
    this.clearVerifySubscription();
  }

  clearVerifySubscription() {

    if (this.emailVerifiedSubscription) {
      clearInterval(this.emailVerifiedSubscription);
    }

    this.emailVerifiedSubscription = null;
  }

  async ionViewDidEnter() {

    this.setTimer();

    this.email = this.route.snapshot.paramMap.get('email');
    this.code = this.route.snapshot.paramMap.get('code');

    if (!this.email) {
      return this.navCtrl.navigateRoot(['not-found']);
    }
    if (this.code) {
      this.verify();
    } else  {
      this.loader = false;
    }

    const { value } = await Storage.get({ key: 'unVerifiedToken' });

    const unVerifiedTokenData = JSON.parse(value);

    if (unVerifiedTokenData && !this.code) {
      this.unVerifiedToken = unVerifiedTokenData.token;

      this.emailVerifiedSubscription = setInterval(_ => {

        this.timeElapsedToVerify += this.timeIntervalToVerify;

        if (this.timeElapsedToVerify >= this.timeoutToVerify) {
          this.clearVerifySubscription();
          return this.navCtrl.navigateRoot(['/']);
        }

        this.isAlreadyVerified(unVerifiedTokenData);
      }, this.timeIntervalToVerify);
    }
  }

  /**
   * Verify verification code
   */
  verify() {

    this.loader = true;

    this.verifyEmailSubscription = this.authService.verifyEmail(this.email, this.code).subscribe(async res => {

      if (this.isVerified) {
        return true;
      }

      if (res.operation == 'success') {
        this.onSuccess(res);
      } else {
        this.loader = false;
        this.errorMsg = res.message;
        // const alert = await this.alertCtrl.create({
        //   message: this.translateService.errorMessage(res.message),
        //   buttons: [this.translateService.transform('Okay')]
        // });
        // await alert.present();
      }
    }, err => {
      // this.loader = false;
    });
  }

  /**
   * Update email address
   */
  async updateEmail() {

    const Cancel = this.translateService.transform('Cancel');
    const Submit = this.translateService.transform('Submit');
    const ChangeEmail = this.translateService.transform('Change Email');
    const NewEmail = this.translateService.transform('Enter New Email');

    const alert = await this.alertCtrl.create({
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
   * Check if email already verified
   * @param res
   */
  isAlreadyVerified(res) {

    this.isAlreadyVerifiedSubscription = this.authService.isAlreadyVerified(res).subscribe(response => {

      if (response.status == 1 && !this.isVerified) {
        this.onSuccess(res);
      }
    });
  }

  /**
   * on successfull verification
   * @param res
   */
  async onSuccess(res) {

    // don't call twise

    if (this.isVerified) {
      return null;
    }

    this.isVerified = true;

    this.clearVerifySubscription();

    this.clearTimer();

    Storage.remove({ key: 'unVerifiedToken' });

    // on email update from profile page

    if (this.authService.isLogin) {
      // this.loader = false;
      this.eventService.userUpdated$.next({}); // email updated

      if (res.isProfileCompleted) {
        this.navCtrl.navigateRoot(['/']);
      } else {
        this.navCtrl.navigateRoot(['complete-profile']);
      }

      // on sign up

    } else {
      this.authService.setAccessToken(res);
    }
  }

  /**
   * On update email submit event
   * @param data
   */
  async onUpdateEmailSubmit(data) {

    const loader = await this.loadingCtrl.create();
    await loader.present();

    let action;

    if (this.authService.isLogin) {
      action = this.accountService.updateEmail(data.newEmail);
    } else {
      const params = {
        unVerifiedToken: this.unVerifiedToken,
        newEmail: data.newEmail
      };
      action = this.authService.updateEmail(params);
    }

    this.updateEmailSubscription = action.subscribe(async result => {

        loader.dismiss();

        if (result.operation == 'success') {

          this.email = data.newEmail;

          // reset timer
          this.runTimer = true;
          this.setTimer();

          return true;

        } else if (result.operation == 'error-session-expired') {
          const toast = await this.toastCtrl.create({
            message: this.translateService.transform('Session expired, please log back in.'),
            duration: 3000
          });
          await toast.present();

          this.authService.logout();

          return false;

        } else {

          const toast = await this.toastCtrl.create({
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
    
    grecaptcha.ready(() => {
      grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token) => {
         
         this.onValidCaptcha(token);
      });
    });  
  }

  onValidCaptcha(token) {
    const ok = this.translateService.transform('Okay');

    this.resendEmailSubscription = this.authService.resendVerificationEmail(this.email, token).subscribe(async res => {

      // reset timer
      this.runTimer = true;
      this.setTimer();

      const alert = await this.alertCtrl.create({
        message: this.translateService.errorMessage(res.message),
        buttons: [ok]
      });
      await alert.present();

      if (
        res.operation != 'success' &&
        (
          res.errorCode == 1 || // if email already verified
          res.errorCode == 3 // account not founnd
        )
      ) {
        this.navCtrl.navigateRoot(['/']);
      }
    });
  }

  /**
   * close page
   */
  dismiss() {
    this.navCtrl.navigateRoot(['landing']);
  }
}
