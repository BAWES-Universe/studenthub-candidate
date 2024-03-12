import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import {CandidateService} from "../../../providers/logged-in/candidate.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.page.html',
  styleUrls: ['./work-history.page.scss'],
})
export class WorkHistoryPage implements OnInit {

  public candidate;
  public workHistory;
  public downloading = false;

  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public router: Router,
    public platform: Platform,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public candidateService: CandidateService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService
  ) {
  }

  ionViewDidEnter() {
  }

  ngOnInit() {
    this.analyticsService.page('Work History Page');

    // Initialize the Login Form
  }

  ngOnDestroy() {
    
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Work History Page'
    });
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  isFutureDate(date) {
    return new Date(date) > new Date();
  }

  /**
   * download certificate
   * @param history
   */
  download(history) {
    this.downloading = true;
    this.candidateService.downloadCertificate(history.id).subscribe(data => {

      /*if(this.platform.is('android') && this.platform.is('capacitor')) {
        this.toastCtrl.create({
          message: this.translateService.transform("File Saved!"),
          duration: 1500
        }).then(toast => toast.present());
      }*/

    },error => {},
    () => {
          this.downloading = false;
    });
  }
}
