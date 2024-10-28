import { Component, OnInit, ViewChild } from '@angular/core';
import { CandidateNotificationService } from '../../../providers/logged-in/candidate-notification.service';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { AnalyticsService } from '../../../providers/analytics.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
// models
import { CandidateNotification } from '../../../models/candidate-notification';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public candidateNotifications: CandidateNotification[] = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public candidateNotificationService: CandidateNotificationService
  ) { }


  ngOnInit() {
    this.analyticsService.page('Activity List page');
  }

  ionViewWillEnter() {
    this.loadData();

    //mark invitations as viewed 
    this.candidateNotificationService.markReadAll().subscribe();
  }
 
  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Activity List page'
    });
  
    this.content.scrollToPoint(0, 0);
  }

  loadData(event: any = null) {
    this.loading = true; 

    const params = this.getUrlParams();

    this.candidateNotificationService.list(this.currentPage, params).subscribe(response => {
      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidateNotifications = response.body;

      if (event && event.target) {
        event.target.complete();
      }
    }, err => {
      this.loading = false;
    });
  }

  getUrlParams() {
    return "&expand=invitation,invitation.request,invitation.company,invitation.request.requestSkills,candidateWorkingDate," + 
      "candidateWorkingDate.health,candidateWorkLogFeedback,candidateWorkLogFeedback.createdBy," +
      "company,staff,store,";
  }

  doInfinite(event) {

    if (this.currentPage == this.pageCount) {
      if (event && event.target) {
        return event.target.complete();
      }
    }
    this.currentPage++;

    this.loading = true; 

    const params = this.getUrlParams();

    this.candidateNotificationService.list(this.currentPage, params).subscribe(response => {
      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidateNotifications = this.candidateNotifications.concat(response.body);
    }, err => {
      this.loading = false;
    });
  }

  doRefresh(event) {
    event.preventDefault();
    event.stopPropagation();

    this.loadData(event);
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    //this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }
}
