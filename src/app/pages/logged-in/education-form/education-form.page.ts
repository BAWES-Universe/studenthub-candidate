import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { CandidateEducation } from 'src/app/models/candidate-education';
import { Candidate } from 'src/app/models/candidate';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//pages
import { UniversityPage } from '../university/university.page';
import { MajorPage } from './major/major.page';
import { DegreePage } from './degree/degree.page';
import { CandidateEducationService } from 'src/app/providers/logged-in/candidate-education.service';


@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.page.html',
  styleUrls: ['./education-form.page.scss'],
})
export class EducationFormPage implements OnInit {

  public candidate: Candidate;
  public candidateEducations: CandidateEducation[];

  public saving: boolean;

  constructor(
    public candidateEducationService: CandidateEducationService,
    public translateService: TranslateLabelService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {  
    this.analyticsService.page('Education Form page'); 

    this.candidateEducations = Object.assign([], this.candidate.candidateEducations);

    if(this.candidateEducations.length == 0) {
      this.addEducation();
    }
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Education Form page'
    });
  }

  ionViewDidEnter() { 

  }

  validateData() {
    for(let e of this.candidateEducations) {
      
      if(e.university_id == null) {
        return false;
      }
    }

    return true;
  }

  save() {

    if(!this.validateData()) {
    
      this.alertCtrl.create({
        message: this.translateService.errorMessage("University is required field"),
        buttons: [this.translateService.transform('Okay')]
      }).then(alert => {
        alert.present();
      });
      
      //this.dismiss();

      return false;
    }

    this.saving = true; 

    this.candidateEducationService.save(this.candidateEducations).subscribe(res => {

      if(res.operation == 'success') {
         
        this.dismiss({
          candidateEducations: res.candidateEducations
        });

      } else {
        this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }

      this.saving = false;
    });
  } 

  addEducation() {
    let candidateEducation = new CandidateEducation;
    candidateEducation.university_id = null;
    candidateEducation.degree_uuid = null;
    candidateEducation.major_uuid = null;
    candidateEducation.graduation_year = null;
    candidateEducation.is_currently_studying = null;

    this.candidateEducations.push(candidateEducation);
  }

  async chooseUniversity(candidateEducation) {
    //window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UniversityPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      /*if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }*/

      if(e.data && e.data.university) {
        candidateEducation.university = e.data.university;
        candidateEducation.university_id = e.data.university.university_id;
      }
    });
    modal.present();
  }

  async chooseDegree(candidateEducation) {
   // window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: DegreePage,
      componentProps: {
        //candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.degree) {
        candidateEducation.degree = e.data.degree;
        candidateEducation.degree_uuid = e.data.degree.degree_uuid;
      }
    });
    modal.present();
  }

  async chooseMajor(candidateEducation) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: MajorPage,
      componentProps: {
       //candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.major) {
        candidateEducation.major = e.data.major;
        candidateEducation.major_uuid = e.data.major.major_uuid;
      }
    });
    modal.present();
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }
}
