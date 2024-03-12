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
  selector: 'app-date-of-birth',
  templateUrl: './date-of-birth.page.html',
  styleUrls: ['./date-of-birth.page.scss'],
})
export class DateOfBirthPage implements OnInit {

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

    this.analyticsService.page('Date of birth page');

    this.min = '1980-01-01';

    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.max = new Date((yyyy), mm).toISOString();

    this._initForm();
  }

  ngOnDestroy() {

  }
  
  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Date of birth page'
    });
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      birth_date: [this.candidate.candidate_birth_date, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  submit() {

    const date = format(parseISO(this.form.value.birth_date), 'yyyy-MM-dd');

    this.isLoading = true;
    
    this.candidate.candidate_birth_date = date;

    this.accountService.updateBirthDate(date).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_birth_date = res.candidate_birth_date;
        
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
    this.dismiss();
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
