import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { CustomValidator } from 'src/app/validators/custom.validator';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {

  public loginForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  // Store old email and password to make sure user won't make same mistake twice
  public oldEmailInput = "";
  public oldPasswordInput = "";

  // Store number of invalid password attempts to suggest reset password
  private _numberOfLoginAttempts = 0;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    public translateService: TranslateLabelService,
    private _alertCtrl: AlertController
  ) {
    // Initialize the Login Form
    this.loginForm = this._fb.group({
      email: ["", [Validators.required, CustomValidator.emailValidator]],
      password: ["", Validators.required]
    });
  }

  /**
   * Attempts to login with the provided email and password
   */
  async onSubmit() {
    this.isLoading = true;

    const email = this.oldEmailInput = this.loginForm.value.email;
    const password = this.oldPasswordInput = this.loginForm.value.password;

    this._auth.basicAuth(email, password).subscribe(async res => {
      this.isLoading = false;

      if (res.operation == "success") {
        // Successfully logged in, set the access token within AuthService
        this._auth.setAccessToken(res);
      } else if (res.operation == "error") {
        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Unable to Log In'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }

    }, async err => {
      this.isLoading = false;

      // Incorrect email or password
      if (err.status == 401) {
        this._numberOfLoginAttempts++;

        // Check how many login attempts this user made, offer to reset password
        if (this._numberOfLoginAttempts > 2) {
          let alert = await this._alertCtrl.create({
            header: this.translateService.transform('Trouble Logging In?'),
            message: this.translateService.transform("If you've forgotten your password, contact us to have it reset."),
            buttons: [this.translateService.transform('Okay')],
          });
          alert.present();
        }
        else {
          let alert = await this._alertCtrl.create({
            header: this.translateService.transform('Invalid email or password'),
            message: this.translateService.transform('The information entered is incorrect. Please try again.'),
            buttons: [this.translateService.transform('Try Again')],
          });
          alert.present();
        }
      } else {
        /**
         * Error not accounted for. Show Message
         */
        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Unable to Log In'),
          message: this.translateService.transform("There seems to be an issue connecting to Payroll servers. Please contact us if the issue persists."),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    });
  }
}
