import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.page.html',
  styleUrls: ['./id-card.page.scss'],
})
export class IdCardPage implements OnInit {

  @ViewChild('inptId', { static: false }) inptId: IonInput;

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this._initForm();

    setTimeout(() => {
      this.inptId.setFocus();
    }, 500);
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      civil_id: [this.candidate.candidate_civil_id, Validators.required],
    });
  }

  /**
   * save civil_id
   */
  submit() {
    this.isLoading = true; 

    this.accountService.updateCivilId(this.form.value.civil_id).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_civil_id = this.form.value.civil_id;
        
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
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }
}
