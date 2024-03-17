import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import {CandidateWorkingHour} from "../../../../models/candidate";
import {CandidateWorkingHourService} from "../../../../providers/logged-in/candidate-working-hour.service";
import {BalanceService} from "../../../../providers/logged-in/balance.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


declare var window;

@Component({
  selector: 'app-wallet-balance-list-page',
  templateUrl: './wallet-balance-list.page.html',
  styleUrls: ['./wallet-balance-list.page.scss'],
})
export class WalletBalanceListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public balances: any[];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public eventService: EventService,
    public balanceService: BalanceService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Wallet Balance List');

    this.eventService.requestUpdated$.subscribe(_ => {
      this.loadData();
    });
  }

  ngOnDestroy() {

  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Wallet Balance List'
    });

    this.content.scrollToPoint(0, 0);
  }

  /**
   * load balance
   */
  loadData() {
    this.loading = true;
    this.balanceService.payableList(this.currentPage).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.balances = response.body;
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

    this.balanceService.payableList(this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.balances = this.balances.concat(response.body);
        
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }
  getStartTime(hour) {
    return hour.dateListByCandidate[0].start_time;
  }

  getEndTime(hour) {
    return hour.dateListByCandidate[hour.dateListByCandidate.length - 1].end_time;
  }

  secondsToTime(secs){
    var h = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var m = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var s = Math.ceil(divisor_for_seconds);

    return `${h?`${h}:`:""}${m?`${m}:${s}`:`${s}s`}`;
  }

  positive(value) {
    return Math.abs(value);
  }

  walletUrl() {
    window.location.href = 'https://wallet.bawes.net/';
  }
}

