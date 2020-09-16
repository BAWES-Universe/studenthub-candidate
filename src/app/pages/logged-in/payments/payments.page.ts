import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, IonContent, ModalController } from '@ionic/angular';
// models
import { Salary } from 'src/app/models/salary';
import { Candidate } from '../../../models/candidate';
// services
import { EventService } from 'src/app/providers/event.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
// pages
import { OptionPage } from '../option/option.page';
import { UpdateBankPage } from '../update-bank/update-bank.page';


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
  public salaries: Salary[] = [];
  public candidate: Candidate;

  public loading = false;

  constructor(
    public translateService: TranslateLabelService,
    public statisticService: StatisticService,
    public awsService: AwsService,
    public candidateService: CandidateService,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public accountService: AccountService,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData();
    this.profile();
  }

  /**
   * load page data
   */
  loadData(refresh = false) {
    this.statisticService.get().subscribe(response => {
      this.statistics = response;
    });

    // this.loadWorkHistoryData();

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
   * Load list of transfers
   */
  async profile() {

    this.accountService.profileWithBank().subscribe(response => {

      this.candidate = response;
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
  }

  async updateBank($e) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UpdateBankPage,
      componentProps: {
        candidate: this.candidate,
      }
    });
    modal.onDidDismiss().then(e => {

      this.profile();
      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }
}
