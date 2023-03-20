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
  selector: 'app-name',
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage implements OnInit {

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
    this.analyticsService.page('Name page');

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
      name: [this.candidate.candidate_name, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  async submit() {

    const name = this.form.value.name.split(' ').length;

    if (name == 1) {
      const prompt = await this.alertCtrl.create({
        message: this.translateService.transform('Please specify your full name'),
        buttons: [this.translateService.transform('Okay')]
      });
      prompt.present();
      return false;
    }

    // this.isLoading = true;

    this.accountService.updateName(this.form.value.name).subscribe(res => {

      // this.isLoading = false;

      if(res.operation == 'success') {
        this.candidate.candidate_name = this.form.value.name;

        this.eventService.nameUpdated$.next({
          candidate_name: this.candidate.candidate_name,
          candidate_name_ar: this.candidate.candidate_name_ar
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
