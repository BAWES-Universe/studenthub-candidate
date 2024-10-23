import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
//models
import { CandidateWorkingHour } from 'src/app/models/candidate';
import { CandidateWorkHistory } from 'src/app/models/candidate-work-history';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-candidate-assignment',
  templateUrl: './candidate-assignment.page.html',
  styleUrls: ['./candidate-assignment.page.scss'],
})
export class CandidateAssignmentPage implements OnInit {
 
  public id;
  
  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public history: CandidateWorkHistory;

  public candidateWorkingHourData: CandidateWorkingHour[] = [];

  public segment: string = "logs";
  
  public end_date;
  public start_date;
  public startDateFormatted;
  public endDateFormatted;

  constructor(
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public activateRoute: ActivatedRoute,
    public candidateService: CandidateService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');

    this.analyticsService.page('Candidate Assigment');

    //this.loadData();
    this.loadAssignment();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Candidate Assigment'
    });
  }

  loadAssignment() {
    this.candidateService.workHistoryDetail(this.id).subscribe(res => {
      this.history = res;

      if(this.history)
        this.loadData();
    })
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
      }
    });
    modal.present();
  }

  getUrlParams() {
    let url = '&expand=dateStatus,checkIn,checkOut&candidate_id=' + this.history.candidate_id + 
      "&store_id=" + this.history.store_id;

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
     
    this.candidateWorkingHour.list(this.currentPage, this.getUrlParams()).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
 
    this.candidateWorkingHour.list(this.currentPage, this.getUrlParams()).subscribe(response => {

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

  doRefresh(event) {

    if (this.segment == "details") {
      this.loadAssignment();
    } else {
      this.loadData();
    }

    event.target.complete();
  }

  segmentChanged(event) {

  }
}
