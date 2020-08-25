import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
// validators
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


const { Storage } = Plugins;

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

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    // @Optional() public nav: IonNav, // for testing perpose
    public navCtrl: NavController,
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.nameInput.setFocus();
    }, 300);

  }

  async ngOnInit() {

    if (window.history.state.email) {
      this.email = window.history.state.email;
    } else {
      this.dismiss();
    }


    // Initialize the Login Form
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
  onSubmit() {
    if (!this.registerForm.valid) {
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

        this.navCtrl.navigateRoot(['landing']).then(() => {

          this.navCtrl.navigateForward(['verify-email', this.registerForm.controls.email.value],
              {
                state : {
                  newUser : 1
                }
              }
          );
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
    this.navCtrl.back();
  }

  loginPage() {
    //   this.nav.pop();
  }
}
