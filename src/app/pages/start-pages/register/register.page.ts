import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, IonNav, ModalController, NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { PreLoad } from 'src/app/util/preLoad';
// validators
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//pages
import { PasswordPage } from '../password/password.page';


const { Storage } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
//@PreLoad('VerifyEmailPage')
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
    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [this.email, [Validators.required, CustomValidator.emailValidator]],
      phone: [null, [Validators.required, Validators.maxLength(10)]],
      password: [null, [Validators.required, Validators.maxLength(30)]],
      lang : [this.translateService.currentLang]
    });
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  async onSubmit() {
    
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

    this.isLoading = true;

    this.authService.createAccount(this.registerForm.value).subscribe(res => {
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
    this.nav.canGoBack().then(canGoBack => {
      if(canGoBack) {
        this.nav.pop();
      } else {
        this.modal.dismiss();
      }
    });
  }

  openLoginPage() {
    this.nav.canGoBack().then(canGoBack => {
      if(canGoBack) {
        this.nav.pop();
      } else {
        this.nav.push(PasswordPage);
      }
    });
  }

  /**
   * Toggle password visibility for password field
   */
  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
