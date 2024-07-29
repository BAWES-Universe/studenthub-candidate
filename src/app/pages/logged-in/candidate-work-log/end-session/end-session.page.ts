import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-end-session',
  templateUrl: './end-session.page.html',
  styleUrls: ['./end-session.page.scss'],
})
export class EndSessionPage implements OnInit {
  
  constructor(
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public modalCtrl: ModalController) { }

  ngOnInit() {
    this.analyticsService.page('End session page');
  }

  close(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
