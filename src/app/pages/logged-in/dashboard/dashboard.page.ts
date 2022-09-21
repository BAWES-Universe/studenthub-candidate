import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
import {CandidateService} from '../../../providers/logged-in/candidate.service';
// models
import { Candidate } from '../../../models/candidate';
// pages
import { UpdateBankPage } from '../update-bank/update-bank.page';
import { CompanyPage } from '../company/company.page';
import {UploadVideoPage} from '../upload-video/upload-video.page';
import {WorkHistoryPage} from "../work-history/work-history.page";


declare var window;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public candidate: Candidate;
  public videoInterval;
  public loadingProfile = false;
  public workHistory: any[] = [];
  public updating = false;

  public loading = false;

  public pushNotificationAvailable = true;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public candidateService: CandidateService,
  ) { }

  ngOnInit() {

    window.analytics.page('Dashboard page');

    /**
     * https://sentry.io/organizations/pogi/issues/1843000885/?project=5339282&referrer=slack
     * Cannot read property 'pushNotification' of undefined
     */

    const agent = window.navigator.userAgent.toLowerCase();

    if (
      this.platform.is('ios') && agent.indexOf('safari') > -1 && !(agent.indexOf('chrome') > -1) &&
      (!window.safari || !window.safari.pushNotification)
    ) {
      this.pushNotificationAvailable = false; // ios browser not supporting push notification
    }

    this.loadProfile();

    this.eventService.bankUpdated$.subscribe((data: any) => {

      if (this.candidate) {
        this.candidate.bank_account_name = data.bank_account_name;
        this.candidate.candidate_iban = data.candidate_iban;
        this.candidate.bank = data.bank;
        this.candidate.bank_id = data.bank.bank_id;
      }
    });

    this.eventService.nameUpdated$.subscribe((data: { candidate_name, candidate_name_ar }) => {

      if (this.candidate) {
        this.candidate.candidate_name = data.candidate_name;
        this.candidate.candidate_name_ar = data.candidate_name_ar;
      }
    });

    this.loadWorkHistoryData();
  }

  ionViewWillLeave() {
    this.content.scrollToPoint(0, 0);
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  /**
   * set oneSignal subscription
   */
  setSubscription() {
    this.eventService.setOneSignal$.next();
  }

  /**
   * load candidate profile
   */
  loadProfile() {

    this.loadingProfile = true;

    this.accountService.profile().subscribe(data => {

      this.authService.candidate = data;
      this.authService.saveLoggedInUser();
      this.candidate = data;

      this.loadingProfile = false;

    }, () => {
      this.loadingProfile = false;
      this.updating = false;
    });
  }

  async updateBank($e) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UpdateBankPage,
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

  async updateVideo(event) {
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

      if (e.data && e.data.candidate_video) {

        if (this.candidate) {
          this.candidate.candidate_video = e.data.candidate_video;
          this.candidate.candidate_video_processed = e.data.candidate_video_processed;
        }

        if (!e.data.candidate_video_processed) {
          this.setVideoStatusSubsciption();
        }
      }

      if (e.data && e.data.remove_candidate_video) {
        this.candidate.candidate_video = null;
      }
    });
    modal.present();
  }


  async downloadCertificate(event) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: WorkHistoryPage,
      componentProps: {
        candidate: Object.assign({}, this.candidate),
        workHistory: this.workHistory,
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

  setVideoStatusSubsciption() {

    this.videoInterval = setInterval(() => {
      this.checkVideoStatus();
    }, 5 * 1000); // every 5 second
  }

  /**
   * check video status on cloudinary
   */
  checkVideoStatus() {
    this.accountService.checkVideoStatus().subscribe(response => {

      if (response.candidate_video_processed) {

        clearInterval(this.videoInterval);

        this.videoInterval = null;

        if (this.candidate) {
          this.candidate.candidate_video_processed = true;
          this.candidate.candidate_video = response.candidate_video;
        }

        // fire event to update video reference when available

        this.eventService.candidateVideoProcessed$.next({
          candidate_video: response.candidate_video,
          candidate_video_processed: response.candidate_video_processed
        });
      }
    });
  }

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory().subscribe(response => {
      this.workHistory = response;
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

}

