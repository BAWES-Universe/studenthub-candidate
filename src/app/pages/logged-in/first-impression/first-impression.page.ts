import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { EventService } from 'src/app/providers/event.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//pages
import { ObjectivePage } from '../objective/objective.page';
import { ProfilePhotoPage } from '../profile-photo/profile-photo.page';
import { UploadCvPage } from '../upload-cv/upload-cv.page';
import { UploadVideoPage } from '../upload-video/upload-video.page';
import { IntroductionPage } from '../introduction/introduction.page';


@Component({
  selector: 'app-first-impression',
  templateUrl: './first-impression.page.html',
  styleUrls: ['./first-impression.page.scss'],
})
export class FirstImpressionPage implements OnInit {

  public videoInterval;

  public candidate: Candidate;

  public loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public accountService: AccountService,
    public eventService: EventService,
    public awsService: AwsService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('First Impression page');
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'First Impression page'
    });
  }

  ionViewWillEnter() {
    if(!this.candidate)
      this.loadData();
  }

  async loadData() {
    this.loading = true;

    this.accountService.profile().subscribe(async res => {
      this.candidate = res;
    });
  }

  setVideoStatusSubsciption() {

    this.videoInterval = setInterval(() => {
      this.checkVideoStatus();
    }, 5 * 1000);//every 5 second
  }

  /**
   * check video status on cloudinary
   */
  checkVideoStatus() {
    this.accountService.checkVideoStatus().subscribe(response => {

      if(response.candidate_video_processed) {

        clearInterval(this.videoInterval);

        this.videoInterval = null;

        if(this.candidate) {
          this.candidate.candidate_video_processed = true;
          this.candidate.candidate_video = response.candidate_video;
        }

        //fire event to update video reference when available 
        
        this.eventService.candidateVideoProcessed$.next({
          candidate_video: response.candidate_video,
          candidate_video_processed: response.candidate_video_processed
        });
      }
    })
  }

  async updateVideo() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UploadVideoPage,
      componentProps: {
        candidate: Object.assign({}, this.candidate),
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.candidate_video) {

        if(this.candidate) {
          this.candidate.candidate_video = e.data.candidate_video;
          this.candidate.candidate_video_processed = e.data.candidate_video_processed;
        }
        
        if(!e.data.candidate_video_processed) {
          this.setVideoStatusSubsciption();
        }
      }
      
      if(e.data && e.data.remove_candidate_video) {
        this.candidate.candidate_video = null;
      }
    });
    modal.present();
  }

  async updateResume() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UploadCvPage,
      componentProps: {
        candidate: Object.assign({}, this.candidate),
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.candidate_resume) {
        this.candidate.candidate_resume = e.data.candidate_resume;
      }
    });
    modal.present();
  }

  async updatePhoto() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ProfilePhotoPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  async updateIntro() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: IntroductionPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  async updateObjective() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ObjectivePage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  onVideoError() {
    this.candidate.candidate_video = null;
  }
  
  onPhotoError() {
    this.candidate.candidate_personal_photo = null;
  }
  
  dismiss() {
    this.navCtrl.back();
  }
}
