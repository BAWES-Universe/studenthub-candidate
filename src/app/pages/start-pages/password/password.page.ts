import { Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AlertController, IonNav, ModalController, NavController } from '@ionic/angular';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';


const { Storage } = Plugins;

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  @ViewChild('passwordInput') passwordInput;

  public loginForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;
  public resettingPassword = false;

  // Store old phone number and password to make sure user won't make same mistake twice
  public oldPhoneInput = '';
  public oldPasswordInput = '';

  // Store number of invalid password attempts to suggest reset password
  public numberOfLoginAttempts = 0;
  public email;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    // @Optional() public nav: IonNav // for testing perpose
  ) { 
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.passwordInput.setFocus();
    }, 300);
  }

  async ngOnInit() {

    if (window.history.state.email) {
      this.email = window.history.state.email;
    } else {
      //https://www.pivotaltracker.com/story/show/174454456
      //this.back();
    }

    // Initialize the Login Form
    this.loginForm = this.fb.group({
      email: [this.email, [Validators.required]],
      password: ['', Validators.required]
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({});
  }

  back() {
    this.navCtrl.back();
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  onSubmit() {
    this.isLoading = true;

    const email = this.oldPhoneInput = this.loginForm.value.email;
    const password = this.oldPasswordInput = this.loginForm.value.password;

    this.authService.basicAuth(email, password).subscribe(res => {

      this.isLoading = false;

      if (res.operation == 'success') {
        // Successfully logged in, set the access token within AuthService
        this.authService.setAccessToken(res);
        // this.dismiss();
      } else if (res.operation == 'error' && res.errorType == 'email-not-verified') {

        Storage.set({
          key: 'unVerifiedToken',
          value: JSON.stringify(res.unVerifiedToken)
        });

        this.navCtrl.navigateRoot(['landing']).then(() => {

          this.navCtrl.navigateForward(['verify-email', email],
              {
                state : {
                  newUser : 0
                }
              }
          );
        });

      } else {
        this.alertCtrl.create({
          header: this.translateService.transform('Unable to Log In'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        }).then(alert => alert.present());
      }

    }, err => {
      this.isLoading = false;

      // Incorrect phone or password
      if (err.status == 401) {
        this.numberOfLoginAttempts++;

        // Check how many login attempts this user made, offer to reset password
        if (this.numberOfLoginAttempts > 2) {
          this.alertCtrl.create({
            header: this.translateService.transform('Trouble Logging In?'),
            message: this.translateService.transform('If you\'ve forgotten your password, contact us to have it reset.'),
            buttons: [this.translateService.transform('Okay')],
          }).then(alert => alert.present());
        } else {
          this.alertCtrl.create({
            header: this.translateService.transform('Invalid password'),
            message: this.translateService.transform('The information entered is incorrect. Please try again.'),
            buttons: [this.translateService.transform('Try Again')]
          }).then(alert => alert.present());
        }
      } else {

        /**
         * Error not accounted for. Show Message
         */
        this.alertCtrl.create({
          header: this.translateService.transform('Unable to Log In'),
          message: this.translateService.transform('There seems to be an issue connecting to servers. Please contact us if the issue persists.'),
          buttons: [this.translateService.transform('Okay')],
        }).then(alert => alert.present());
      }
    });
  }

  /**
   * reset password
   */
  resetPasswordRequest() {
    this.resettingPassword = true;
    this.authService.resetPasswordRequest(this.email).subscribe( res => {
      this.resettingPassword = false;
      this.alertCtrl.create({
        message: res.message,
        buttons: [this.translateService.transform('Okay')]
      }).then(alert => alert.present());
    });
  }
}
