import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit {

  public submitting: boolean = false; 

  public loading: boolean = false; 

  public candidate: Candidate;
  public candidatePicUrl;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,

  ) {
    this.candidatePicUrl = environment.cloudinaryUrl;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true; 

    this.accountService.profile().subscribe(res => {
      this.candidate = res; 

      //if having complete profile

      if(res.isProfileCompleted) {
        this.authService.isProfileCompleted = true;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/']);
      }

      this.loading = false;
    }, () => {
      this.loading = false;
    })
  }

  async updateName () {

    const modal = await this.modalCtrl.create({
      component: NamePage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateNameArabic() {
    
    const modal = await this.modalCtrl.create({
      component: NameArPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateEmail() {
    
    const modal = await this.modalCtrl.create({
      component: UpdateEmailPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
    //redirect email verification page

  }

  async updatePhone() {

    const modal = await this.modalCtrl.create({
      component: PhonePage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updatePhoto() {

    const modal = await this.modalCtrl.create({
      component: ProfilePhotoPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateObjective() {

    const modal = await this.modalCtrl.create({
      component: ObjectivePage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateSkills() {

    const modal = await this.modalCtrl.create({
      component: SkillFormPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateExperiences() {

    const modal = await this.modalCtrl.create({
      component: ExperienceFormPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateCandidateIdNumber() {

    const modal = await this.modalCtrl.create({
      component: IdCardPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateUniversity() {

    const modal = await this.modalCtrl.create({
      component: UniversityPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateNationality() {

    const modal = await this.modalCtrl.create({
      component: NationalityPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateDateOfBirth() {

    const modal = await this.modalCtrl.create({
      component: DateOfBirthPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateGender() {

    const modal = await this.modalCtrl.create({
      component: GenderPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateDrivingLicense() {

    const modal = await this.modalCtrl.create({
      component: DrivingLicensePage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  async updateResume() {

    const modal = await this.modalCtrl.create({
      component: UploadCvPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.present();
  }

  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/') + ' UTC');
  }

  async submit() {
    this.navCtrl.navigateRoot(['/']);
  }
}
