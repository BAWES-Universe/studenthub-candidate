import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  public segment: string = "details";
  
  constructor(
    public activateRoute: ActivatedRoute,
    public candidateService: CandidateService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService) { }

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

  getUrlParams() {
    return '&expand=dateStatus,checkIn,checkOut&candidate_id=' + this.history.candidate_id + 
      "&store_id=" + this.history.store_id;
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
