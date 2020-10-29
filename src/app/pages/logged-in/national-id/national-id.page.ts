import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CivilExpiryPage } from '../civil-expiry/civil-expiry.page';
import { CivilIdBackPage } from '../civil-id-back/civil-id-back.page';
import { CivilIdFrontPage } from '../civil-id-front/civil-id-front.page';
import { IdCardPage } from '../id-card/id-card.page';


@Component({
  selector: 'app-national-id',
  templateUrl: './national-id.page.html',
  styleUrls: ['./national-id.page.scss'],
})
export class NationalIdPage implements OnInit {

  public candidate: Candidate;

  public loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public accountService: AccountService,
    public awsService: AwsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.candidate)
      this.loadData();
  }

  async loadData() {
    this.loading = true;

    this.accountService.profile().subscribe(async res => {
      this.candidate = res.profile;
    });
  }

  async updateCandidateIdExpiryDate() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CivilExpiryPage,
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

  async updateCivilIdFront() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CivilIdFrontPage,
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

  async updateCivilIdBack() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CivilIdBackPage,
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

  async updateCandidateIdNumber() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: IdCardPage,
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

  onCivilBackError() {
    this.candidate.candidate_civil_photo_back = null;
  }
  
  onCivilFrontError() {
    this.candidate.candidate_civil_photo_front = null;
  }

  /**
   * convert mysql date to browser readable date format
   * @param date 
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/') + ' UTC');
  }
  
  dismiss() {
    this.navCtrl.back();
  }
}
