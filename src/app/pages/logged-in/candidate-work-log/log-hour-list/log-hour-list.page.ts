import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, IonContent } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { format, parseISO } from 'date-fns';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import {CandidateWorkingHourService} from 'src/app/providers/logged-in/candidate-working-hour.service';
// models
import {CandidateWorkingHour} from 'src/app/models/candidate';
import { CandidateWorkingDate } from "../../../../models/candidate-working-date";

declare var window;

@Component({
  selector: 'app-log-hour-list-page',
  templateUrl: './log-hour-list.page.html',
  styleUrls: ['./log-hour-list.page.scss'],
})
export class LogHourListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public totalHours = 0;
  public date;

  public candidateWorkingHourData: CandidateWorkingHour[] = [];

  //public stats: any; 

  public candidateWorkingDate: CandidateWorkingDate;

  constructor(
    public platform: Platform,
    public activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    public authService: AuthService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.date = this.activateRoute.snapshot.paramMap.get('date');

    this.analyticsService.page('Candidate Working Hours');
  }

  ionViewWillEnter() {
    this.loadData();
    this.loadDetail();
  }

  doRefresh(event) {
    this.loadData();
    this.loadDetail();
    event.target.complete();
  }

  loadDetail() {
    this.candidateWorkingHour.dateDetail(this.date).subscribe(res => {
      this.candidateWorkingDate = res;
    });
  }

  /*loadStats() {
    this.candidateWorkingHour.stats(this.getUrlParams()).subscribe(response => {
      this.stats = response;
    });
  }*/

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
    
    this.candidateWorkingHour.listHours(this.currentPage, this.getUrlParams()).subscribe(response => {
      this.loading =  false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
      // this.countTotal();
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.candidateWorkingHour.listHours(this.currentPage, this.getUrlParams()).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingHourData = this.candidateWorkingHourData.concat(response.body);

        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  getUrlParams() { 
    return "&date=" + format(parseISO(this.date), 'yyyy-MM-dd');
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  } 
}

