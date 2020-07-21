import {Component, Input, OnInit, Optional, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


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

  constructor(
      public router: Router,
      public fb: FormBuilder,
      public alertCtrl: AlertController,
      public authService: AuthService,
      public translateService: TranslateLabelService,
      // @Optional() public nav: IonNav, // for testing perpose
      public navCtrl: NavController,
      public modalCtrl: ModalController,
  ) {
    // Initialize the Login Form
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.nameInput.setFocus();
    }, 300);

  }

  async ngOnInit() {
    // this.registerForm.setValue({email: this.email, phone: null, name: null, password: null});
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  onSubmit() {
    // if (this.registerForm.valid) {
    //   this.isLoading = true;
    //   this._auth.createAccount(this.registerForm.value).subscribe(res => {
    //         if (res.operation === 'success' && res.token) {
    //
    //
    //           this._auth.setAccessToken(res);
    //           this._modalCtrl.dismiss();
    //         } else if (res.operation === 'error') {
    //           this._alertCtrl.create({
    //             message: this._auth.errorMessage(res.message),
    //             buttons: [this.translateService.transform('Okay')]
    //           }).then(alert => {
    //             alert.present();
    //           });
    //         }
    //       }, error => {
    //         this.isLoading = false;
    //       },
    //       () => {
    //         this.isLoading = false;
    //       }
    //   );
    // }
  }

  dismiss() {
    this.navCtrl.back();
  }

  loginPage() {
  //   this.nav.pop();
  }
}
