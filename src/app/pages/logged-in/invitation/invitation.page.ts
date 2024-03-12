import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Invitation } from 'src/app/models/invitation';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


declare var window;

@Component({
  selector: 'app-invitation-page',
  templateUrl: './invitation.page.html',
  styleUrls: ['./invitation.page.scss'],
})
export class InvitationPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public invitations: Invitation[] = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public eventService: EventService,
    public invitationService: InvitationService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Invitation List page');

    this.eventService.requestUpdated$.subscribe(_ => {
      this.loadInvitations();
    });
  }

  ngOnDestroy() {

  }
  
  ionViewWillEnter() {
    this.loadInvitations();

    //mark invitations as viewed 
    this.invitationService.markAsViewed().subscribe();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Invitation List page'
    });
  
    this.content.scrollToPoint(0, 0);
  }

  /**
   * load invitations for request
   */
  loadInvitations() {
    this.loading = true;
    this.invitationService.list(this.currentPage).subscribe(data => {
      this.loading =  false;
      this.invitations = data;
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

    this.invitationService.list(this.currentPage).subscribe(response => {

      response.body.forEach(element => {
        this.invitations.push(element);
      });

      if (event && event.target) {
        event.target.complete();
      }
    },
    error => { },
    () => {
      this.loading = false;
    });
  }
}

