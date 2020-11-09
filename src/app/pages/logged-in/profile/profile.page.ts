import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, ToastController, IonContent } from '@ionic/angular';
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
  public required_candidate_mom_kuwaiti_field = false

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public accountService: AccountService,
    public eventService: EventService,
    public awsService: AwsService,
    public translateService: TranslateLabelService,
    public toastCtrl: ToastController,
  ) {
    this.update = location.href.indexOf('view/profile') > -1;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {

    this.loading = true;

    this.accountService.profile().subscribe(res => {
      
      this.candidate = res;
      this.checkKuwaitiNationality()
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

        this.candidate.candidate_video_processed = true;
        this.candidate.candidate_video = response.candidate_video;
        
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
      this.loadData();
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
    });
    modal.present();
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
        this.candidate.candidate_video = e.data.candidate_video;
        this.candidate.candidate_video_processed = e.data.candidate_video_processed;

        if(!this.candidate.candidate_video_processed) {
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
      this.loadData();
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

  /**
   * convert mysql date to browser readable date format
   * @param date 
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/') + ' UTC');
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
   * if user nationality is not kuwait
   * but area is in kuwait
   */
  checkKuwaitiNationality() {
    this.required_candidate_mom_kuwaiti_field = false;
    if (this.candidate && this.candidate.pendingField) {
      this.candidate.pendingField.forEach(data => {
        if(data == 'candidate_mom_kuwaiti') {
          this.required_candidate_mom_kuwaiti_field = true;
        }
      });
    }
  }
}
