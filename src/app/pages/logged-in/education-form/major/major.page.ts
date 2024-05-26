import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { Major } from 'src/app/models/major';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateEducationService } from 'src/app/providers/logged-in/candidate-education.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-major',
  templateUrl: './major.page.html',
  styleUrls: ['./major.page.scss'],
})
export class MajorPage implements OnInit {
 
  public currentPage = 1;

  public totalPage = 0;

  public query = '';
 
  public majorList: Major[] = [];

  public loading = false;
 
  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public translateService: TranslateLabelService,
    public candidateEducationService: CandidateEducationService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Major Page');

    this.loadData(this.currentPage);
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Major Page'
    });
  }

  /**
   * @param ev
   */
  onSearchInput(ev: any) {
    this.query = ev.target.value;
    this.loadData(1);

    /*if (this.majorList) {
      this.universities = this.majorList.filter(item => {
        return (
          item.major_name_en.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
          item.major_name_ar.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1
        );
      });
    }*/
  }

  /**
   * load universities
   * @param page 
   */
  loadData(page: number) {
 
    this.loading = true;

    this.candidateEducationService.listMajors(page, "&query=" + this.query).subscribe(response => {

      this.totalPage = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
 
      this.majorList = response.body;
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

    this.loading = true;

    
    this.loading = true;

    this.candidateEducationService.listMajors(this.currentPage, "&query=" + this.query).subscribe(response => {

      this.totalPage = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
 
      this.majorList = this.majorList.concat(response.body);
    },
      error => { },
      () => {
        this.loading = false;

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
   * on major selection
   * @param major
   */
  async rowSelected(major: Major) {
    this.dismiss({
      major: major
    });
  }
}
