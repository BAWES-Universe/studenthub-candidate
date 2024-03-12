import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { AlertController, IonNav, ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {

  @ViewChild('emailInput') emailInput;

  public registerMobileForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    @Optional() public nav: IonNav, // for testing perpose
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translate: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if(this.emailInput)
        this.emailInput.setFocus();
    }, 300);
  }

  ngOnInit() {
    this.analyticsService.page('Email Page');

    // Initialize the Login Form
    this.registerMobileForm = this.fb.group({
      email: ['', [Validators.required, , CustomValidator.emailValidator]],
    });
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Email Page'
    });
  }

  dismiss() {
    this.nav.canGoBack().then(canGoBack => {
   
      if(canGoBack) {
        this.nav.pop();
      } else {
        this.dismissModal();
      }
    });
    //this.navCtrl.back();
  }

  dismissModal() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss();
      }
    });
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  async onSubmit() {
    
    if (!this.registerMobileForm.valid) {
      return false;
    }

    this.isLoading = true;
    
    this.authService.mobileCheck(this.registerMobileForm.value).subscribe(async res => {
      if (res) {

        if (res.operation === 'error') {

          const alert = await this.alertCtrl.create({
            header: this.translate.transform('Error!'),
            message: this.translate.errorMessage(res.message),
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();

        } else if (res.operation === 'success' && res.message != false) {

          this.navCtrl.navigateForward('password', {
            state: {
              email: this.registerMobileForm.value.email
            }
          });

        } else {
          
          this.navCtrl.navigateForward(['register'], { 
            state: {
              email: this.registerMobileForm.value.email
            }
          });
        }
      }
    }, error => {
      this.isLoading = false;
    },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    
  }
}
