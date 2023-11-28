import { Component, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController, IonContent, IonNav, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
//validators
import { CustomValidator } from '../../../validators/custom.validator';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


declare let grecaptcha;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition: number = 0;

  resetForm: FormGroup;
  smsForm: FormGroup;

  submitAttempt = false;

  public isLoading = false;

  public sendPasswordSubscription: Subscription;

  public borderLimit: boolean = false;

  public segment = 'email';

  constructor(
    public _fb: FormBuilder,
    public router: Router,
    public translate: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public _authService: AuthService,
    public _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    @Optional() public nav: IonNav // for testing perpose
  ) {
  }

  ngOnInit() {
    this.analyticsService.page('Forgot Password Page');

    this.resetForm = this._fb.group({
      email: ['', [Validators.required, CustomValidator.emailValidator]],
    });

    this.smsForm  = this._fb.group({
      phone_number: ['', [Validators.required, CustomValidator.phoneNumberValidator]],
    });
  }

  ngOnDestroy() {
    if (!!this.sendPasswordSubscription) {
      this.sendPasswordSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Forgot Password Page'
    });

    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  /**
   * move to previous page if can or close popup
   */
  dismiss() {
    this.nav.canGoBack().then(canGoBack => {
   
      if(canGoBack) {
        this.nav.pop();
      } else {
        this.dismissModal();
      }
    });
  }

  dismissModal() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss();
      }
    });
  }
  
  /**
   * Request new password by sms link 
   */
  async sendSMS() {

    this.submitAttempt = true;

    if (!this.smsForm.valid) {

      const alert = await this._alertCtrl.create({
        message: this.translate.transform('Please enter valid phone number.'),
        buttons: [this.translate.transform('Okay')]
      });
      await alert.present();

      return false;
    }

    this.isLoading = true;

    this.sendPasswordSubscription = this._authService.resetPasswordSMS(this.smsForm.value.phone_number)
      .subscribe(async data => {

        if(data.operation == 'success') {
          const alert = await this._alertCtrl.create({
            message: data.message,
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();
          this.loginPage();
        } else {
          const alert = await this._alertCtrl.create({
            message: this._authService.errorMessage(data.message),
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();
        }

      },
      error => { },
      () => {
        this.isLoading = false;
      });
  }

  /**
   * Request new password
   */
  async sendPassword() {

    if (!this.resetForm.valid) {

      const alert = await this._alertCtrl.create({
        message: this.translate.transform('Please enter valid email address'),
        buttons: [this.translate.transform('Okay')]
      });
      await alert.present();

      return false;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token) => {
         
         this.onValidCaptcha(token);
      });
    });  
  }

  onValidCaptcha(token) {

    this.submitAttempt = true;

    this.isLoading = true;

    this.sendPasswordSubscription = this._authService.resetPasswordRequest(this.resetForm.value.email, token)
      .subscribe(async data => {

        if(data.operation == 'success') {
          const alert = await this._alertCtrl.create({
            message: data.message,
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();
          this.loginPage();
        } else {
          const alert = await this._alertCtrl.create({
            message: this._authService.errorMessage(data.message),
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();
        }

      },
      error => { },
      () => {
        this.isLoading = false;
      });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Open login page
   */
  loginPage() {
    this.router.navigate(['/login']);
  }
}
