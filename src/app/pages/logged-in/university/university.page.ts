import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AlertController, ModalController} from '@ionic/angular';
// services
import { UniversityService } from 'src/app/providers/university.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
// models
import { Candidate } from 'src/app/models/candidate';
import { University } from 'src/app/models/university';


@Component({
  selector: 'app-university',
  templateUrl: './university.page.html',
  styleUrls: ['./university.page.scss'],
})
export class UniversityPage implements OnInit {

  public candidate: Candidate;

  public currentPage = 1;

  public totalPage = 0;

  public query = '';

  public universities: University[];

  public universityList: University[];

  public loading = false;

  public updatingUniversity = false;

  public doInfiniteSubscription: Subscription;
  public updateSubscription: Subscription;
  public universitySubscription: Subscription;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public universityService: UniversityService,
    public translateService: TranslateLabelService,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  /**
   * @param ev
   */
  onSearchInput(ev: any) {
    this.query = ev.target.value;
    if (this.universityList) {
      this.universities = this.universityList.filter(item => {
        return (
          item.university_name_en.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
          item.university_name_ar.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1
        );
      });
    }
  }

  loadData(page: number) {

    // Load list of university

    this.loading = true;

    this.universitySubscription = this.universityService.filter(this.query, page).subscribe(response => {

      this.universities = response;
      this.universityList = response;
    },
      error => { },
      () => {
        this.loading = false;
      });
  }

  /**
   * Infinite scroll functionality
   * @param event
   */
  doInfinite(event) {

    if (this.currentPage == this.totalPage) {
      if (event && event.target) {
        return event.target.complete();
      }
    }

    this.currentPage++;

    this.doInfiniteSubscription = this.universityService.filter(this.query, this.currentPage).subscribe(response => {
      for (const university of response) {
        this.universities.push(university);
      }
      if (event && event.target) {
        event.target.complete();
      }
    });
  }

  /**
   * close modal
   * @param data
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  /**
   * on university selection
   * @param university
   */
  async rowSelected(university: University) {
    this.candidate.university_id = university.university_id;
    this.candidate.university = university;

    this.accountService.updateUniversity(university.university_id).subscribe(async response => {
      if (response.operation != 'success') {
        const alert = await this.alertCtrl.create({
          message: response.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      } else  {
        this.dismiss();
      }
    });
  }
}
