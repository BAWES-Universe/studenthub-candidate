import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, IonNav, ModalController, NavController } from '@ionic/angular';
// validators
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Preferences as Storage } from '@capacitor/preferences';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EmailPage } from '../email/email.page';
import { PasswordPage } from '../password/password.page';


declare let grecaptcha;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('nameInput') nameInput;

  // @ViewChild('nameInput') nameInput;
  public registerForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  // @Input() email;
  public email;
  public type = 'password';

  public showPass = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public auth: Auth0Service,
    @Optional() public nav: IonNav, // for testing perpose
    public navCtrl: NavController,
    public modal: ModalController
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if(this.nameInput)
        this.nameInput.setFocus();
    }, 300);
  }

  async ngOnInit() {
    this.analyticsService.page('Register Page');

    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [this.email, [Validators.required, CustomValidator.emailValidator]],
      phone: [null, [Validators.required, Validators.maxLength(10)]],
      password: [null, [Validators.required, Validators.maxLength(30)]],
      lang : [this.translateService.currentLang]
    });
  }

  ngOnDestroy() {

  }
  
  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Register Page'
    });
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  async onSubmit() {

    //e.preventDefault();

    if (!this.registerForm.valid) {
      return false;
    }
   
    const name_ar = this.registerForm.value.name.split(' ').length;

    if (name_ar == 1) {
      const prompt = await this.alertCtrl.create({
        message: this.translateService.transform('Please specify your full name'),
        buttons: [this.translateService.transform('Okay')]
      });
      prompt.present();
      return false;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token) => {
         const params = {
            ...this.registerForm.value, 
            token: token
         };

         this.onValidCaptcha(params);
      });
    });  
  }

  onValidCaptcha(params) {

    this.isLoading = true;

    this.authService.createAccount(params).subscribe(res => {
      this.isLoading = false;

      if (res.operation == 'success') {

        Storage.set({
          key: 'unVerifiedToken',
          value: JSON.stringify(res.unVerifiedToken)
        });

        this.modal.dismiss().then(() => {
          setTimeout(() => {
            this.navCtrl.navigateRoot(['landing']).then(() => {

              this.navCtrl.navigateForward(['verify-email', this.registerForm.controls.email.value],
                  {
                    state : {
                      newUser : 1
                    }
                  }
              );
            });
          }, 100);
        });

      } else if (res.operation === 'error') {

        //validation error 

        if(res.code == 2 && res.message.candidate_email) {
          this.openLoginPage();
        }

        this.alertCtrl.create({
          message: this.authService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    }, error => {
      this.isLoading = false;
    });
  }

  dismiss() {
    if (this.nav) {
      this.nav.canGoBack().then(canGoBack => {
        if(canGoBack) {
          this.nav.pop();
        } else {
          this.dismissModal();
        }
      });
    } else  {
      this.dismissModal();
    }
  }

  dismissModal() {
    this.modal.getTop().then(overlay => {
      if (overlay) {
        this.modal.dismiss();
      }
    });
  }

  openLoginPage() {
    if (this.nav) {
      this.nav.canGoBack().then(canGoBack => {
        if (canGoBack) {
          this.nav.pop();
        } else {
          this.nav.push(PasswordPage)
;        }
      });
    } else  {
      this.dismissModal();
    }
  }

  /**
   * Toggle password visibility for password field
   */
  showPassword() {
    this.showPass = !this.showPass;
    this.type = (this.showPass) ? 'text' : 'password';
  }
}
