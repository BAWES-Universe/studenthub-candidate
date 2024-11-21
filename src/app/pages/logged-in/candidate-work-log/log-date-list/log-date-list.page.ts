import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import {CandidateWorkingDate} from "../../../../models/candidate-working-date";
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


declare var window;

@Component({
  selector: 'app-log-date-list-page',
  templateUrl: './log-date-list.page.html',
  styleUrls: ['./log-date-list.page.scss'],
})
export class LogDateListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public candidateWorkingDates: CandidateWorkingDate[] = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public candidateService: CandidateService,
    public eventService: EventService, 
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Candidate Working Hours');
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Candidate Working Hours'
    });
   
    this.content.scrollToPoint(0, 0);
  }

  /**
   * load invitations for request
   */
  loadData() {
    this.loading = true;
    this.candidateService.listCandidateWorkingDates(this.currentPage, '&expand=dateStatus,checkIn,checkOut').subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingDates = response.body;
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.candidateService.listCandidateWorkingDates(this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingDates = this.candidateWorkingDates.concat(response.body);
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }
   
  secondsToTime(secs){
    var h = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var m = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var s = Math.ceil(divisor_for_seconds);

    return `${h?`${h}:`:""}${m?`${m}:${s}`:`${s}s`}`;
  }
}

