import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-update-bank',
  templateUrl: './update-bank.page.html',
  styleUrls: ['./update-bank.page.scss'],
})
export class UpdateBankPage implements OnInit {

  @ViewChild('benefName') benefName;

  public candidate;

  public form: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if(this.benefName)
        this.benefName.setFocus();
    }, 300);
  }

  ngOnInit() {
    this.analyticsService.page('Update Bank Page');

    this.form = this.fb.group({
      benef_name: [this.candidate.bank_account_name, [Validators.required]],
      iban: [this.candidate.candidate_iban, [Validators.required]]
    });
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  async onSubmit() {
    
    if (!this.form.valid) {
      return false;
    }

    if (this.form.value.benef_name.split(' ').length == 1) {
      const prompt = await this.alertCtrl.create({
        message: this.translateService.transform('Please specify your full name'),
        buttons: [this.translateService.transform('Okay')]
      });
      prompt.present();
      return false;
    }

    // to remove spaces
    let benefName = this.form.value.benef_name.trim();

    //its keep adding . at the end with space to remove that
    benefName = benefName.replace('.', '');
    const param = {
      benef_name: benefName,
      iban: this.form.value.iban
    };
    this.isLoading = true;

    this.accountService.updateBankDetail(param).subscribe(async res => {
      this.isLoading = false;

      if (res.operation == 'success') {
     
        const data = {
          'bank_account_name' : this.form.value.benef_name,
          'candidate_iban': this.form.value.iban,
          'bank': res.bank
        };

        this.eventService.bankUpdated$.next(data);
        
        this.dismiss(data);
      }
      else if (res.operation == 'error') {
        this._handleError(res);
      }

    }, error => {
      this.isLoading = false;
    });
  }

  /**
   * Handle error
   * @param res
   */
  async _handleError(res) {
    const ok = this.translateService.transform('Okay');

    const prompt = await this.alertCtrl.create({
      message: this.translateService.errorMessage(res.message),
      buttons: [ok]
    });
    prompt.present();
  }
}
