import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-end-session',
  templateUrl: './end-session.page.html',
  styleUrls: ['./end-session.page.scss'],
})
export class EndSessionPage implements OnInit {
  
  constructor(
    public analyticsService: AnalyticsService,
    public modalCtrl: ModalController) { }

  ngOnInit() {
    this.analyticsService.page('End session page');
  }

  close(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
