import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { Candidate, CandidateWorkingHour } from 'src/app/models/candidate';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';

@Component({
  selector: 'app-log-time-manually',
  templateUrl: './log-time-manually.page.html',
  styleUrls: ['./log-time-manually.page.scss'],
})
export class LogTimeManuallyPage implements OnInit {

  public model: CandidateWorkingHour;

  public form: FormGroup;

  public saving: boolean = false; 

  constructor(
    private _alertCtrl: AlertController,
    private _fb: FormBuilder, 
    public cwhService: CandidateWorkingHourService,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService,
    public modalCtrl: ModalController) { }

  ngOnInit() {
    this.analyticsService.page('Log manually page');

    this.form = this._fb.group({
      start_time: ["", Validators.required],
      end_time: ["", Validators.required],
      note: ["", Validators.required]
    });
  }

  close(data = {}) {
    this.modalCtrl.dismiss(data);
  }

  async save() {
    this.saving = true; 

    this.updateModelFromForm();

    this.cwhService.add(this.model).subscribe(async res => {

      this.saving = false;
      
      if (res.operation == "success") {
        
        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

        this.form.reset();

        this.close({
          refresh: true
        })

      } else if (res.operation == "error") {

        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    });
  } 

  updateModelFromForm() {

    if(!this.model) 
      this.model = new CandidateWorkingHour;

    this.model.start_time = this.form.value.start_time;
    this.model.end_time = this.form.value.end_time;
    this.model.note = this.form.value.note;
  }
}
