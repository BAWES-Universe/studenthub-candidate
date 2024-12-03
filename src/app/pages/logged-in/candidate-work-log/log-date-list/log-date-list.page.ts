import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent, PopoverController } from '@ionic/angular';
import { format } from 'date-fns';
import {
  CalendarModal,
  CalendarModalOptions,
  CalendarResult,
} from 'ion2-calendar';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
// models
import {CandidateWorkingDate} from "../../../../models/candidate-working-date";


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

  public end_date;
  public start_date;
  public startDateFormatted;
  public endDateFormatted;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
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


  async openCalendar() {
    const options: CalendarModalOptions = {
      canBackwardsSelected: true,
      pickMode: 'range',
      title: '',
      defaultScrollTo : new Date(this.end_date ? this.end_date : new Date()),
      defaultDateRange: {
        from: new Date(this.start_date ? this.start_date : ''),
        to: new Date(this.end_date ? this.end_date : '')
      }
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;
    if (date) {
      const from: CalendarResult = date.from;
      const to: CalendarResult = date.to;
      if (from.string) {
        this.start_date = from.string;
        this.startDateFormatted = format(from.dateObj, 'dd/MM/yyyy');
      }
      if (to.string) {
        this.end_date = to.string;
        this.endDateFormatted = format(to.dateObj, 'dd/MM/yyyy');
      }

      if (from.string || to.string) {
        this.loadData();
      }
    }
  }

  async selectEndDate(event)  {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.endDateFormatted,
        date: this.end_date
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.date) {
        this.endDateFormatted = e.data.dateFormatted;
        this.end_date = e.data.date;

        if (this.end_date && this.start_date)
          this.loadData();
      }
    });
    modal.present();
  }

  async selectStartDate(event) {
     
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.startDateFormatted,
        date: this.start_date
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.date) {
        this.startDateFormatted = e.data.dateFormatted;
        this.start_date = e.data.date;

        if (this.end_date && this.start_date)
          this.loadData();
      }
    });
    modal.present();
  }

  getUrlParams() {
    let url = '&expand=';
  
    if (this.start_date) {
      url += "&start_date=" + this.start_date;
    }

    if (this.end_date) {
      url += "&end_date=" + this.end_date;
    }

    return url;
  }

  /**
   * load invitations for request
   */
  loadData() {
    this.loading = true;
    this.candidateService.listCandidateWorkingDates(this.currentPage, this.getUrlParams()).subscribe(response => {
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

    this.candidateService.listCandidateWorkingDates(this.currentPage, this.getUrlParams()).subscribe(response => {

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

