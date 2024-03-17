import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-preferred-time',
  templateUrl: './preferred-time.page.html',
  styleUrls: ['./preferred-time.page.scss'],
})
export class PreferredTimePage implements OnInit {

  @ViewChild('inpt', { static: false }) inpt: IonInput;

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
      if(this.inpt)
        this.inpt.setFocus();
    }, 500);
  }

  ngOnDestroy() {

  }
  
  /**
   * Initialise form
   */
  async _initForm() {
    this.form = this.fb.group({
      preferred_time: [this.candidate.candidate_preferred_time],
    });
  }

  /**
   * save arabic name
   */
  submit() {
    // this.isLoading = true;

    this.accountService.updatePreferredTime(this.form.value).subscribe(res => {

      // this.isLoading = false;

      if (res.operation == 'success') {

        this.candidate.candidate_preferred_time = this.form.value.preferred_time;
      } 
      else 
      {
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
    this.dismiss();
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
