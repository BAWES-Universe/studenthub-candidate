import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { RequestService } from 'src/app/providers/logged-in/request.service';
// models
import { Request } from 'src/app/models/request';
import { RequestViewPage } from '../request-view/request-view.page';


@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public requests: Request[] = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public eventService: EventService,
    public requestService: RequestService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Request List page');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Request List page'
    });
  
    this.content.scrollToPoint(0, 0);
  }

  /**
   * load requests
   */
  loadData() {
    this.loading = true;
    this.requestService.list(this.currentPage, "&expand=requestSkills").subscribe(data => {

      this.loading =  false;
      this.requests = data.body;

      this.pageCount = parseInt(data.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(data.headers.get('X-Pagination-Current-Page'), 10);
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

    this.requestService.list(this.currentPage, "&expand=requestSkills").subscribe(response => {

      this.requests = this.requests.concat(response.body);

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'), 10);
      
      if (event && event.target) {
        event.target.complete();
      }
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  async viewRequest($e, request) {

    $e.preventDefault();
    $e.stopPropagation();

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: RequestViewPage,
      componentProps: {
        request: request,
        request_uuid: request.request_uuid
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
