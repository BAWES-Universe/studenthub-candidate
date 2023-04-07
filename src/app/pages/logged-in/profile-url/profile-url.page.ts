import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-profile-url',
  templateUrl: './profile-url.page.html',
  styleUrls: ['./profile-url.page.scss'],
})
export class ProfileUrlPage implements OnInit {

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  @ViewChild('inptName', { static: false }) inptName: IonInput;

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Profile Url page');

    this._initForm();

    setTimeout(() => {
      if(this.inptName)
        this.inptName.setFocus();
    }, 500);
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      url: [this.candidate.profile_url, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  async submit() {

    // this.isLoading = true;
    let param = {
      url : this.form.value.url
    }
    this.accountService.updateProfileUrl(param).subscribe(res => {

      // this.isLoading = false;

      if(res.operation == 'success') {
        this.candidate.profile_url = this.form.value.url;

        this.eventService.profileUrlUpdated$.next({
          profile_url: this.candidate.profile_url
        });
        
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
