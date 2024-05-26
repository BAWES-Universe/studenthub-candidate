import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import {format, parseISO} from "date-fns";
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-civil-expiry',
  templateUrl: './civil-expiry.page.html',
  styleUrls: ['./civil-expiry.page.scss'],
})
export class CivilExpiryPage implements OnInit {

  public min; //min date
  public max;//max date 

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  constructor(
    public platform: Platform,
    public _fb: FormBuilder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Civil Expiry page');

    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.min = new Date().toISOString();
    this.max = new Date((yyyy + 20), mm).toISOString();
    
    this._initForm();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Civil Expiry page'
    });
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      civil_expiry_date: [this.candidate.candidate_civil_expiry_date, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  submit() {

    const date = this.form.value.civil_expiry_date? 
      format(parseISO(this.form.value.civil_expiry_date), 'yyyy-MM-dd'): null;

    this.isLoading = true;
    
    this.candidate.candidate_civil_expiry_date = date;

    this.accountService.updateCivilExpiryDate(date).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_civil_expiry_date = res.candidate_civil_expiry_date;

        this.dismiss();
        
      } else {
        this.alertCtrl.create({
          message: this.authService.errorMessage(res.message),
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
