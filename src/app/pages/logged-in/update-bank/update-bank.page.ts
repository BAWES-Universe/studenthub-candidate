import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';


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
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.benefName.setFocus();
    }, 300);
  }

  ngOnInit() {
    // Initialize the Login Form
    this.form = this.fb.group({
      benef_name: [this.candidate.transfer_benef_name, [Validators.required]],
      iban: [this.candidate.transfer_benef_iban, [Validators.required]]
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

    this.isLoading = true;

    this.accountService.updateBankDetail(this.form.value).subscribe(async res => {
      this.isLoading = false;

      if (res.operation == 'success') {
        this.dismiss();
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
    const ok = this.translateService.transform('ok');

    const prompt = await this.alertCtrl.create({
      message: this.translateService.errorMessage(res.message),
      buttons: [ok]
    });
    prompt.present();
  }
}
