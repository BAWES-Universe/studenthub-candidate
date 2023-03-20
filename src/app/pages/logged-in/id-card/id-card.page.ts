import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
import {format, parseISO} from "date-fns";
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AuthService } from 'src/app/providers/auth.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


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
  public min; //min date
  public max;//max date

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public accountService: AccountService,
    public sentryService: SentryErrorhandlerService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('ID Card page');

    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.min = new Date().toISOString();
    this.max = new Date((yyyy + 20), mm).toISOString();

    // this._initForm();

    // setTimeout(() => {
    //   if(this.inptId)
    //     this.inptId.setFocus();
    // }, 500);
  }

  ionViewDidEnter() {
    this._initForm();
  }
  /**
   * Initialise form
   */
  _initForm() {
    this.form = this._fb.group({
      civil_id: [this.candidate.candidate_civil_id, Validators.required],
      civil_expiry_date: [this.candidate.candidate_civil_expiry_date, Validators.required],
    });
  }

  /**
   * save civil_id
   */
  submit() {
    this.isLoading = true;

    const date = format(parseISO(this.form.value.civil_expiry_date), 'yyyy-MM-dd');

    this.accountService.updateCivilIdAndExpiryDate(this.form.value.civil_id, date).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {
        this.candidate.candidate_civil_id = this.form.value.civil_id;
        this.candidate.candidate_civil_expiry_date = res.candidate_civil_expiry_date;
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

  async getNameByCivilId(civil_id) {
    this.authService.getNameByCivilId(civil_id).subscribe((data: string) => {
     
      let e = document.querySelector('.civil-id-response');

      e.innerHTML = data;

      let txtName = document.getElementById('#ContentPlaceHolder1_txtName');
      
      if (
        txtName && 
        txtName.attributes.getNamedItem('value') &&
        txtName.attributes.getNamedItem('value').value.length > 0
      ) {
        this.saveArabicName(txtName.attributes.getNamedItem('value').value);
      } else {        
        this.sentryService.handleError('Error on trying to find name for Civil Id: ' + this.form.value.civil_id);
      }
    });
  }

  /**
   * save arabic name
   */
  async saveArabicName(name) {

    this.accountService.updateNameAr(name).subscribe(res => {

      if(res.operation == 'success') {
        this.candidate.candidate_name_ar =name;
      } 
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
