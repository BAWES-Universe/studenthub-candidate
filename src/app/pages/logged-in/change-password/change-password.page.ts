import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, AlertController, IonInput } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public oldPassword: string = '';
  public newPassword: string = '';
  public validatingPassword = false;

  public passwordForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  public type: string = 'password';

  public oldType: string = 'password';

  @ViewChild('inptPassword', { static: false }) inptPassword: IonInput;

  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder,
    public translateService: TranslateLabelService,
    public accountService: AccountService,
    private _alertCtrl: AlertController,
    public analyticsService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticsService.page('Chagne Password page');

    // Initialize the Login Form
    this.passwordForm = this._fb.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required]
    });

    setTimeout(() => {
      if(this.inptPassword)
        this.inptPassword.setFocus();
    }, 800);
  }

  ngOnDestroy() {
    
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Change Password page'
    });
  }

  /**
   * Attempts to login with the provided email and password
   */
  async save() {

    const oldP = this.passwordForm.value.oldPassword;
    const newP = this.passwordForm.value.newPassword;

    if (!this.passwordForm.valid) {
      return false;
    }

    this.isLoading = true;

    this.accountService.changePassword(oldP, newP).subscribe(async res => {

      this.isLoading = false;
      
      if (res.operation == "success") {
        
        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

        this.passwordForm.reset();

        this.navCtrl.navigateRoot(['/'], { 
          animated: true,
          animationDirection: 'forward',
        });

      } else if (res.operation == "error") {

        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    }, () => {
      this.isLoading = false;
    });
  } 

  toggleOldPasswordVisibility() {
    this.oldType = this.oldType == 'text'? 'password': 'text';
  }

  /**
   * toggle password field
   */
  togglePasswordVisibility() {
    this.type = this.type == 'text'? 'password': 'text';
  }

  /**
   * validate password on type
   * @param event
   */
  async validateOldPassword(event) {
    
    event.stopPropagation();

    this.validatingPassword = true;
    let param = {
      password: this.passwordForm.value.oldPassword
    };
    this.accountService.validatePassword(param).subscribe(async result => {
      this.validatingPassword = false;
      this.passwordForm.controls['oldPassword'].setErrors(null);
      if (!result) {
        this.passwordForm.controls['oldPassword'].setErrors({'incorrect': true});
      }
    }, async (err) => {

      const prompt = await this._alertCtrl.create({
        message: err,
        buttons: ['Okay']
      });
      prompt.present();
    }, () => {
      this.validatingPassword = false;
    });
  }
}
