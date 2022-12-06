import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
import {CandidateService} from "../../../providers/logged-in/candidate.service";


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
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public candidateService: CandidateService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
  ) {
  }

  ionViewDidEnter() {
    console.log(this.workHistory);
  }

  ngOnInit() {
    window.analytics.page('Work History Page');

    // Initialize the Login Form

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

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
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
    },error => {},
    () => {
          this.downloading = false;
    });
  }
}
