import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Invitation } from 'src/app/models/invitation';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';

import {InvitationFeedbackPage} from '../invitation-feedback/invitation-feedback.page';
import {CompanyPage} from "../company/company.page";


declare var window;

@Component({
  selector: 'app-invitation-detail-page',
  templateUrl: './invitation-detail.page.html',
  styleUrls: ['./invitation-detail.page.scss'],
})
export class InvitationDetailPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  
  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public model: Invitation;
  public invitation_uuid: string;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public eventService: EventService,
    public invitationService: InvitationService,
    public translateService: TranslateLabelService,
    public activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    window.analytics.page('Invitation Detail page');

    // Load the passed model if available
    if (window.history.state) {
      this.model = window.history.state.invitation;
    }

    this.invitation_uuid = this.activateRoute.snapshot.paramMap.get('invitation_uuid');
    this.loadInvitationDetail();

    this.eventService.requestUpdated$.subscribe(_ => {
      this.loadInvitationDetail();
    });
  }

  ionViewWillLeave() {
    this.content.scrollToPoint(0, 0);
  }

  /**
   * load invitations for request
   */
  loadInvitationDetail() {
    this.loading = true;
    this.invitationService.detail(this.invitation_uuid).subscribe(data => {
      this.loading =  false;
      this.model = data;
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
   * open popup to accept invitation with reason
   * @param $event
   */
  async accept($event) {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const invitation = Object.assign({}, this.model);

    invitation.invitation_status = 3; // accept

    const modal = await this.modalCtrl.create({
      component: InvitationFeedbackPage,
      componentProps: {
        invitation
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.onUpdate.emit();
      }
    });
  }

  /**
   * open popup to reject invitation with reason
   * @param $event
   */
  async reject($event) {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const invitation = Object.assign({}, this.model);

    invitation.invitation_status = 2; // reject

    const modal = await this.modalCtrl.create({
      component: InvitationFeedbackPage,
      componentProps: {
        invitation
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.onUpdate.emit();
      }
    });
  }
  dismiss() {
    this.navCtrl.back();
  }

  /**
   * open popup to accept invitation with reason
   * @param $event
   */
  async companyDetailPage($event) {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyPage,
      componentProps: {
        company: this.model.company
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
  }
}

