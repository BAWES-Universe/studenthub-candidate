import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
// models
import { Salary } from 'src/app/models/salary';
// services
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
// pages
import { OptionPage } from '../option/option.page';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public permanentBucketUrl = environment.permanentBucketUrl;

  public pageCount = 0;
  public currentPage = 1;

  public workHistory: any[] = [];

  public statistics: any;
  public salaries: Salary[];

  public loading = false;

  constructor(
    public statisticService: StatisticService,
    public candidateService: CandidateService,
    public popoverCtrl: PopoverController,
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
    return candidate.candidate_personal_photo_thumb = null;
  }
}
