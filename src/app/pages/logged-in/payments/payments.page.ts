import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, IonContent } from '@ionic/angular';
// models
import { Salary } from 'src/app/models/salary';
// services
import { EventService } from 'src/app/providers/event.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
// pages
import { OptionPage } from '../option/option.page';


@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public pageCount = 0;
  public currentPage = 1;

  public workHistory: any[] = [];

  public statistics: any;
  public salaries: Salary[];

  public loading = false;

  constructor(
    public translateService: TranslateLabelService,
    public statisticService: StatisticService,
    public awsService: AwsService,
    public candidateService: CandidateService,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public accountService: AccountService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData();
  }

  /**
   * load page data
   */
  loadData(refresh = false) {
    this.statisticService.get().subscribe(response => {
      this.statistics = response;
    });

    this.loadWorkHistoryData();

    this.currentPage = 1;
    this.listSalary(this.currentPage, refresh);
  }

  ionViewWillLeave() {
    this.content.scrollToPoint(0, 0);
  }

  /**
   * broadcast scroll event
   * @param e 
   */
  logScrolling(e) {
    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  } 

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory().subscribe(response => {
      this.workHistory = response;
    });
  }

  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: OptionPage,
      event: e
    });
    popover.present();
  }

  /**
   * Load list of transfers
   * @param page
   * @param refresher
   */
  async listSalary(page: number, refresher: any = null) {

    if (!refresher) {
      this.loading = true;
    }

    this.accountService.listSalary(page).subscribe(response => {

      this.salaries = response.body;

      // Dismiss the refresher if available
      if (refresher) {
        refresher.target.complete();
      }

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.accountService.listSalary(this.currentPage).subscribe(response => {

      response.body.forEach(element => {
        this.salaries.push(element);
      });

      event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
    return candidate.candidate_personal_photo_thumb = null;
  }
}
