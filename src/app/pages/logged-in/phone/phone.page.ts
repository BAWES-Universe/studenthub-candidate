import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


@Component({
  selector: 'app-phone',
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {

  @ViewChild('inptPhone', { static: false }) inptPhone: IonInput;

  public isLoading = false;

  public candidate: Candidate;

  public form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this._initForm();

    setTimeout(() => {
      this.inptPhone.setFocus();
    }, 500);
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this.fb.group({

      phone: [this.candidate.candidate_phone, [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    });
  }

  /**
   * save arabic name
   */
  submit() {
    this.isLoading = true;

    this.accountService.updatePhoneDetail(this.form.value).subscribe(res => {

      this.isLoading = false;

      if (res.operation == 'success') {

        this.candidate.candidate_phone = this.form.value.phone;

        this.dismiss();
      } else {
        this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * close modal
   * @param data
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }
}
