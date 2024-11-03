import { Component, OnInit, ViewChild } from '@angular/core';
import { CandidateNotificationService } from '../../../providers/logged-in/candidate-notification.service';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { AnalyticsService } from '../../../providers/analytics.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { EventService } from '../../../providers/event.service';
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

  public totalUnreadActity: number = 0;

  public candidateNotifications: CandidateNotification[] = [];

  public showRefresh: boolean = false; 
  
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public candidateNotificationService: CandidateNotificationService
  ) { }


  ngOnInit() {
    this.analyticsService.page('Activity List page');

    this.eventService.alertCount$.subscribe((
      counts : {
        total,
        pendingInvitations,
        totalUnreadActity
      }
    ) => {
      if(!counts)
        return null; 
         
      if (this.totalUnreadActity > 0 && this.totalUnreadActity != counts.totalUnreadActity) {
        this.showRefresh = true;
      } /*else {
        this.showRefresh = false;
      }*/

      this.totalUnreadActity = counts.totalUnreadActity;
    });
  }

  ionViewWillEnter() {
    this.loadData();

    //mark invitations as viewed 
   // this.candidateNotificationService.markReadAll().subscribe();
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

      this.totalUnreadActity = parseInt(response.headers.get('X-Total-Unread-Actity'));

      if (event && event.target) {
        event.target.complete();
      }
    }, err => {
      this.loading = false;
    });
  }

  getUrlParams() {
    //invitation.request.requestSkills,candidateWorkingDate,candidateWorkingDate.health,,
    return "&expand=invitation,invitation.request,invitation.company," + 
      "company,staff,store,candidateWorkingHour,candidateWorkingDate,candidateWorkLogFeedback,candidateWorkLogFeedback.createdBy";
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

      this.totalUnreadActity = parseInt(response.headers.get('X-Total-Unread-Actity'));
    }, err => {
      this.loading = false;
    });
  }

  doRefresh(event = null) {
    this.showRefresh = false;

    /*if (event) {
      event.preventDefault();
      event.stopPropagation();
    }*/

    this.loadData(event);
  }

  markRead(candidateNotification) {
    candidateNotification.is_new = false; 

    this.candidateNotificationService.markRead(candidateNotification.cn_uuid).subscribe();
  }
  
  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    //this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }
}
