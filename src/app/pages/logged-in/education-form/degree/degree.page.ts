import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { Degree } from 'src/app/models/degree';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateEducationService } from 'src/app/providers/logged-in/candidate-education.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-degree',
  templateUrl: './degree.page.html',
  styleUrls: ['./degree.page.scss'],
})
export class DegreePage implements OnInit { 
 
  public currentPage = 1;

  public totalPage = 0;

  public query = '';
 
  public degreeList: Degree[] = [];

  public loading = false;
 
  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public translateService: TranslateLabelService,
    public candidateEducationService: CandidateEducationService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Degree Page');

    this.loadData(this.currentPage);
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Degree Page'
    });
  }

  /**
   * @param ev
   */
  onSearchInput(ev: any) {
    this.query = ev.target.value;
    this.loadData(1);

    /*if (this.degreeList) {
      this.universities = this.degreeList.filter(item => {
        return (
          item.degree_name_en.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
          item.degree_name_ar.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1
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

    this.candidateEducationService.listDegrees(page, "&query=" + this.query).subscribe(response => {

      this.totalPage = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
 
      this.degreeList = response.body;
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

    this.candidateEducationService.listDegrees(this.currentPage, "&query=" + this.query).subscribe(response => {

      this.totalPage = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
 
      this.degreeList = this.degreeList.concat(response.body);
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
   * on degree selection
   * @param degree
   */
  async rowSelected(degree: Degree) {
    this.dismiss({
      degree: degree
    });
  }
}
