import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// models
import { Ticket } from 'src/app/models/ticket';
import { AuthService } from 'src/app/providers/auth.service';
// services
import { TicketService } from 'src/app/providers/logged-in/ticket.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
// pages
import { TicketFormPage } from '../ticket-form/ticket-form.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss'],
})
export class TicketListPage implements OnInit {

  public tickets: Ticket[] = [];

  public perPageCount = 20;
  public currentPage = 0;
  public totalPages = 0;

  public loading = false;

  public borderLimit: boolean = false;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public ticketService: TicketService,
    public analytics: AnalyticsService
  ) { }

  async ngOnInit() {
    this.analytics.page('Ticket list page');

    this.currentPage = 1;
    this.loadData();
  }

	ionViewWillLeave() {
		this.analytics.track('page_exit', {
		  'page': 'Ticket list page'
		});
	}

  /**
   * load tickets
   */
  loadData() {

    this.loading = true;

    this.ticketService.list(this.currentPage).subscribe(response => {

      this.perPageCount = parseInt(response.headers.get('X-Pagination-Per-Page'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

      this.tickets = response.body;
    },
      error => this.loading = false,
      () => this.loading = false,
    );
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    if (this.currentPage >= this.totalPages) {

      if (event && event.target)
        event.target.complete();
      return null;
    }

    this.loading = true;

    this.currentPage++;

    this.ticketService.list(this.currentPage).subscribe(response => {

      this.perPageCount = parseInt(response.headers.get('X-Pagination-Per-Page'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

      this.tickets = this.tickets.concat(response.body);

      if (event && event.target)
        event.target.complete();

    }, err => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * show form to add new ticket
   */
  async showTicketForm() {

    window.history.pushState({
      navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: TicketFormPage,
      cssClass: 'popup-modal',
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }
}
