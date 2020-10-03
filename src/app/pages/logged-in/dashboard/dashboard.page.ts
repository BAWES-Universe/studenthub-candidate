import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
//models
import { Candidate } from '../../../models/candidate';
//pages
import { UpdateBankPage } from "../update-bank/update-bank.page";
import { CompanyPage } from '../company/company.page';


declare var window;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public candidate_job_search_status: any;
  public candidate: Candidate;

  public updating = false;

  public loading = false;

  public store;

  public company;

  public pushNotificationAvailable: boolean = true;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
  ) { }

  ngOnInit() {

    /**
     * https://sentry.io/organizations/pogi/issues/1843000885/?project=5339282&referrer=slack
     * Cannot read property 'pushNotification' of undefined
     */
    
    const agent = window.navigator.userAgent.toLowerCase();

    if(this.platform.is('ios') && agent.indexOf('safari') > -1 && (!window.safari || !window.safari.pushNotification)) {
      this.pushNotificationAvailable = false; // ios browser not supporting push notification
    }

    this.loadData();
    this.loadProfile();
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
   * load job search status ,.
   */
  async loadData() {
    this.loading = true;

    this.accountService.getJobSearchStatus().subscribe(res => {

      this.candidate_job_search_status = res.candidate_job_search_status;

      this.store = res.store;
      this.company = res.company;

      /*if(!res.isProfileCompleted) {

        this.authService.isProfileCompleted = false;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/complete-profile']);
      }*/

      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * set oneSignal subscription
   */
  setSubscription() {
    this.eventService.setOneSignal$.next();
  }

  /**
   * update job search status
   */
  updateJobSearchStatus() {

    const params = {
      job_search_status: this.candidate_job_search_status == 1 ? 0 : 1
    };

    this.updating = true;

    this.candidate_job_search_status = params.job_search_status;

    this.accountService.updateJobSearchStatus(params).subscribe(data => {

      this.updating = false;

      if (data.operation != 'success') {
        this.candidate_job_search_status = !params.job_search_status; // back to old status
      }
    }, () => {
      this.updating = false;
    });
  }

  getFirstName() {
    if(this.authService.name && this.authService.name.length > 1) {
      const FullName = this.authService.name.split(' ');
      return (FullName[0]) ? FullName[0] : this.authService.name;
    }
  }

  loadProfile() {
    this.accountService.profile().subscribe(data => {

      this.candidate = data;
    }, () => {
      this.updating = false;
    });
  }

  /**
   * show popup for company details
   */
  async viewCompanyDetails() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyPage,
      componentProps: {
        company: this.company,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
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

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }
}

