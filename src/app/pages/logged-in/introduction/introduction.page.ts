import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, AlertController, IonTextarea } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {

  @ViewChild('inputToFocus', { static: false }) inputToFocus: IonTextarea;

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Introduction page');

    this._initForm();
  }

  ngOnDestroy() {

  }
  
  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Introduction page'
    });
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      intro: [this.candidate.candidate_intro, Validators.required],
    });

    setTimeout(() => {
      if(this.inputToFocus)
        this.inputToFocus.setFocus();
    }, 500);
  }

  /**
   * save intro
   */
  submit() {
    this.isLoading = true;
    
    this.candidate.candidate_intro = this.form.value.intro;

    this.accountService.updateIntro(this.form.value.intro).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_intro = this.form.value.intro;

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
