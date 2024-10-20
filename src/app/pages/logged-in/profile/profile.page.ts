import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalController, NavController, ToastController, IonContent, PopoverController, Platform} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
//models
import { Candidate } from 'src/app/models/candidate';
//pages
import { NamePage } from '../name/name.page';
import { NameArPage } from '../name-ar/name-ar.page';
import { PhonePage } from '../phone/phone.page';
import { ProfilePhotoPage } from '../profile-photo/profile-photo.page';
import { ObjectivePage } from '../objective/objective.page';
import { SkillFormPage } from '../skill-form/skill-form.page';
import { ExperienceFormPage } from '../experience-form/experience-form.page';
import { IdCardPage } from '../id-card/id-card.page';
import { UniversityPage } from '../university/university.page';
import { NationalityPage } from '../nationality/nationality.page';
import { DateOfBirthPage } from '../date-of-birth/date-of-birth.page';
import { GenderPage } from '../gender/gender.page';
import { DrivingLicensePage } from '../driving-license/driving-license.page';
import { UploadCvPage } from '../upload-cv/upload-cv.page';
import { UpdateEmailPage } from '../update-email/update-email.page';
import { CivilExpiryPage } from '../civil-expiry/civil-expiry.page';
import { CivilIdFrontPage } from '../civil-id-front/civil-id-front.page';
import { CivilIdBackPage } from '../civil-id-back/civil-id-back.page';
import { UploadVideoPage } from '../upload-video/upload-video.page';
import { LocationPage } from '../location/location.page';
import { OptionPage } from '../option/option.page';
import { PreferredTimePage } from '../preferred-time/preferred-time.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import {ProfileUrlPage} from "src/app/pages/logged-in/profile-url/profile-url.page";
import { IntroductionPage } from '../introduction/introduction.page';
import { EducationFormPage } from '../education-form/education-form.page';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { WorkHistoryPage } from '../work-history/work-history.page';
import { UpdateBankPage } from '../update-bank/update-bank.page';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public videoInterval;

  public submitting: boolean = false;

  public loading: boolean = false;

  public update;

  public candidate: Candidate;

  public pendingFields = '';

  public borderLimit;

  public workHistory: any[] = [];
  public currentAssignments: any[] = [];

  public salaryTransfers: any[] = [];

  segment = "work-details";

  public pageCount;
  public currentPage;

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public accountService: AccountService,
    public eventService: EventService,
    public candidateService: CandidateService,
    public awsService: AwsService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public platform: Platform,
  ) {
    
  }

  ngOnInit() {
    this.update = location.href.indexOf('view/profile') > -1;

    this.analyticsService.page('Profile page');
  }

  ionViewWillEnter() {
    this.loadData();
    this.loadWorkHistoryData();
    this.listSalary(1);
  }
 
  toggleOpen(history, event) {
    event.preventDefault();
    event.stopPropagation();
    history.isOpen = !history.isOpen;
  }

  /**
   * Load list of transfers
   * @param page
   * @param refresher
   */
  async listSalary(page: number, refresher: any = null) {

    if (!refresher) {
      this.loading = true;
    }

    this.accountService.listSalary(page).subscribe(response => {

      this.salaryTransfers = response.body;

      // Dismiss the refresher if available
      if (refresher && refresher.target) {
        refresher.target.complete();
      }

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

    },
      error => { },
      () => {
        this.loading = false;
      });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfiniteSalary(event) {

    this.loading = true;

    this.currentPage++;

    this.accountService.listSalary(this.currentPage).subscribe(response => {

      this.salaryTransfers = this.salaryTransfers.concat(response.body)

      if (event && event.target) {
        event.target.complete();
      }
    },
      error => { },
      () => {
        this.loading = false;
      });
  }

  imageError(history) {
    history.company.company_logo = null;
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

      if(e.data && e.data.bank && this.candidate) {
        this.candidate.bank_account_name = e.data.bank_account_name;
        this.candidate.candidate_iban = e.data.candidate_iban;
        this.candidate.bank_id = e.data.bank.bank_id;
        this.candidate.bank = e.data.bank;
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

  isFutureDate(date) {
    return new Date(date) > new Date();
  }

  /*segmentChanged(event) {
    this.segment = event.detail.value;
  }*/

    doRefresh(event) {
      this.loadData();
      this.loadWorkHistoryData();
      event.target.complete();
    }

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory().subscribe(response => {
      this.workHistory = response.filter(e => e.end_date != null);
      this.currentAssignments = response.filter(e => e.end_date == null);
    });
  }

  openAssignment(history, $event) {
    this.navCtrl.navigateForward("/candidate-assignment/" + history.id);
  }

  /**
   * load candidate details
   */
  async loadData() {

    this.loading = true;

    this.accountService.profile().subscribe(res => {

      this.candidate = res;

      //if video not processed keep pinging server

      if(!this.candidate.candidate_video_processed && !this.videoInterval) {
        this.setVideoStatusSubsciption();
      }

      // if (this.candidate.pendingField) {
      //   this.pendingFields = this.candidate.pendingField.join();
      //
      //   const toast = await this.toastCtrl.create({
      //     message: this.translateService.transform('pending_field', { value: this.pendingFields }),
      //     duration: 4000
      //   });
      //   toast.present();
      //
      // }

      //if having complete profile

      /*if(res.isProfileCompleted) {

        this.authService.isProfileCompleted = true;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/']);
      }*/

      if (window.history.state) {
        if (window.history.state.updateCivilId) {
          /*this.candidate.candidate_civil_photo_back = null;
          this.candidate.candidate_civil_photo_front = null;
          this.candidate.candidate_civil_expiry_date = null; 
          this.candidate.candidate_civil_id = null;*/
          this.updateCivilIdFront();
        }
      }
      
      this.loading = false;
    }, () => {
      this.loading = false;
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

  async updateArea() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: LocationPage,
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

  async updateName() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: NamePage,
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

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Profile page'
    });
   
    this.content.scrollToPoint(0, 0);
  }

  onVideoError() {
    this.candidate.candidate_video = null;
  }

  onCivilBackError() {
    this.candidate.candidate_civil_photo_back = null;
  }

  onCivilFrontError() {
    this.candidate.candidate_civil_photo_front = null;
  }

  onPhotoError() {
    this.candidate.candidate_personal_photo = null;
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);

    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  async updateNameArabic() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: NameArPage,
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

  async updateEmail() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UpdateEmailPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (e && e.data && e.data.email) {
        this.navCtrl.navigateRoot(['verify-email', e.data.email]);
      }
      else if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  async updatePhone() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: PhonePage,
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

  async updatePreferredTime() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: PreferredTimePage,
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

  async updateCandidateIdExpiryDate() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CivilExpiryPage,
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

  async updateCivilIdFront() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CivilIdFrontPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
       
      if (e && e.data && e.data.refresh) {

        //this.candidate.candidate_civil_photo_back = e.data.candidate.candidate_civil_photo_back;
        this.candidate.candidate_civil_photo_front = e.data.candidate.candidate_civil_photo_front;
        this.candidate.candidate_civil_expiry_date = e.data.candidate.candidate_civil_expiry_date;
        this.candidate.candidate_civil_id = e.data.candidate.candidate_civil_id;
        this.candidate.civilExpired = e.data.candidate.civilExpired;

        if (!this.candidate.candidate_civil_photo_back || window.history.state.updateCivilId) {
          setTimeout(() => {
            this.updateCivilIdBack();
          }, 200);
        } else {
          this.checkIfIDAvaialable();
        }
      }
    });
    modal.present();
  }

  async updateCivilIdBack() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CivilIdBackPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.candidate.candidate_civil_photo_back = e.data.candidate.candidate_civil_photo_back;
        //this.candidate.candidate_civil_photo_front = e.data.candidate.candidate_civil_photo_front;
        this.candidate.candidate_civil_expiry_date = e.data.candidate.candidate_civil_expiry_date;
        this.candidate.candidate_civil_id = e.data.candidate.candidate_civil_id;
        this.candidate.civilExpired = e.data.candidate.civilExpired;
        
        if (!this.candidate.candidate_civil_photo_front) {
          setTimeout(() => {
            this.updateCivilIdFront();
          }, 200)
        } else {
          this.checkIfIDAvaialable();
        }
      }
    });
    modal.present();
  }

  checkIfIDAvaialable() {
    if(
      this.candidate.candidate_civil_photo_front && 
      this.candidate.candidate_civil_photo_back &&
      (!this.candidate.candidate_civil_id || !this.candidate.candidate_civil_expiry_date)
    ) {
      this.updateCandidateIdNumber();
    }
  }

  /**
   * cloudinary video thumbnail url
   * @param candidate_video
   */
  thumbnailUrl(candidate_video) {
    return candidate_video.split('.')[0] + '.jpg';
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

  async updateSkills() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: SkillFormPage,
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

  async updateEducations() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: EducationFormPage,
      componentProps: {
        candidate: Object.assign({}, this.candidate),
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.candidateEducations) {
        this.candidate.candidateEducations = e.data.candidateEducations;
      }
    });
    modal.present();
  }

  async updateExperiences() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ExperienceFormPage,
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

  async updateCandidateIdNumber() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: IdCardPage,
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

  async updateUniversity() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UniversityPage,
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

  async updateNationality() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: NationalityPage,
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

  async updateDateOfBirth() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: DateOfBirthPage,
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

  async updateGender() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: GenderPage,
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

  async updateDrivingLicense() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: DrivingLicensePage,
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

  async profilePage() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ProfileUrlPage,
      componentProps: {
        candidate: Object.assign({}, this.candidate),
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.profile_url) {
        this.candidate.profile_url = e.data.profile_url;
      }
    });
    modal.present();
  }

  /**
   * open dashboard
   */
  async submit() {
    this.authService.isProfileCompleted = true;
    this.authService.saveLoggedInUser();

    this.navCtrl.navigateRoot(['/']);
  }

  translate() {

    const code = this.translateService.currentLang != 'ar' ? 'ar' : 'en';

    this.eventService.setLanguagePref$.next(code);

    if (this.authService.isLogin) {
      this.accountService.setLanguagePref(code).subscribe();
    }
  }

  async updateKuwaitiNationalStatus() {
    this.eventService.kuwaitiNationl$.next(this.candidate);
  }

  /**
   * return area name
   * @param area
   * @param country
   */
  area(area, country) {
    if(this.translateService.currentLang == 'en')
      return this.translateService.langContent(area.area_name_en, area.area_name_ar) + ', ' +
        this.translateService.langContent(country.country_name_en, country.country_name_ar);

    return this.translateService.langContent(area.area_name_en, area.area_name_ar) + ' ، ' +
      this.translateService.langContent(country.country_name_en, country.country_name_ar);
  }

  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param e
   */
   async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: OptionPage,
      event: e
    });
    popover.present();
  }
}
