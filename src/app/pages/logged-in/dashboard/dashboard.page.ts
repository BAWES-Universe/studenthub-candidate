import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
//models
import { Candidate } from '../../../models/candidate';
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
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

  public loadingProfile: boolean = false; 

  public updating = false;

  public loading = false;

  public store: Store;

  public company: Company;

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

    if (
      this.platform.is('ios') && agent.indexOf('safari') > -1 && !(agent.indexOf('chrome') > -1) && 
      (!window.safari || !window.safari.pushNotification)
    ) {
      this.pushNotificationAvailable = false; // ios browser not supporting push notification
    }

    this.loadData();
    this.loadProfile();

    this.eventService.bankUpdated$.subscribe((data: any) => {
      
      if(this.candidate) {
        this.candidate.bank_account_name = data.bank_account_name;
        this.candidate.candidate_iban = data.candidate_iban;
        this.candidate.bank = data.bank;
        this.candidate.bank_id = data.bank.bank_id;
      }
    });
        
    this.eventService.nameUpdated$.subscribe((data: { candidate_name, candidate_name_ar }) => {

      if(this.candidate) {
        this.candidate.candidate_name = data.candidate_name;
        this.candidate.candidate_name_ar = data.candidate_name_ar;
      }
    });
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
      this.company = (res.parent_company) ? res.parent_company : res.company;

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

  /**
   * load candidate profile
   */
  loadProfile() {

    this.loadingProfile = true;

    this.accountService.profile().subscribe(data => {

      this.candidate = data;

      this.loadingProfile = false;

    }, () => {
      this.loadingProfile = false
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

