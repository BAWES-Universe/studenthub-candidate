import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public translateService: TranslateLabelService,
    public router: Router,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Not Found page');
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Not Found page'
    });
  }

  ionViewWillEnter() {
    this.modalCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss();
      }
    })

    this.loadingCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss();
      }
    })
  }

  /**
   * Open dashboard
   */
  dashboard() {
    this.router.navigate(['/']);
  }
}
