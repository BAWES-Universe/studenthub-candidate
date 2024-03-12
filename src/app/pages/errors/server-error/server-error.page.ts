import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.page.html',
  styleUrls: ['./server-error.page.scss'],
})
export class ServerErrorPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public translateService: TranslateLabelService,
    public router: Router,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Server Error page');
  }

  ngOnDestroy() {

  }
  
  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Server Error page'
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
