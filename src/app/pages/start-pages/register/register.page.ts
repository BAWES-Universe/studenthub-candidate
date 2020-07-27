import { Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // @Input() email;

  @ViewChild('nameInput') nameInput;
  // @ViewChild('nameInput') nameInput;

  public registerForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;
  public email;

  constructor(
    public storage: Storage,
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    // @Optional() public nav: IonNav, // for testing perpose
    public navCtrl: NavController,
    public modalCtrl: ModalController,
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
      email: [this.email, [Validators.required]],
      phone: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.maxLength(30)]]
    });
  }

  log() {
    // .navigateForward
    this.router.navigate(['verify-email', 'demo@asdasd.com']);
    //this.registerForm.controls.email.value
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

      console.log(res);

      if (res.operation == 'success') {

        this.storage.set("unVerifiedToken", res.unVerifiedToken); 

        this.storage.set('candidate_uuid', res.candidate_id);

        this.navCtrl.navigateForward(['verify-email', this.registerForm.controls.email.value]);

        /*
        this.modalCtrl.getTop().then(overlap => {
          if(overlap)
            this.modalCtrl.dismiss({ 
              from: 'native-back-btn'
            }); 
        }); */

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
