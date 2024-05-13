import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavController, Platform } from '@ionic/angular';
//models
import { RequestInterview } from 'src/app/models/request-interview';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { RequestService } from 'src/app/providers/logged-in/request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.page.html',
  styleUrls: ['./interview-list.page.scss'],
})
export class InterviewListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public interviews: RequestInterview[] = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public eventService: EventService,
    public authService: AuthService,
    public requestService: RequestService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Interview List page');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Interview List page'
    });
  
    this.content.scrollToPoint(0, 0);
  }

  /**
   * load interviews for request
   */
  loadData() {
    this.loading = true;
    this.requestService.listInterviewRequests(this.currentPage).subscribe(response => {
      this.loading =  false;
      this.interviews = response.body;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.requestService.listInterviewRequests(this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.interviews = this.interviews.concat(response.body);

      if (event && event.target) {
        event.target.complete();
      }
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }
}
