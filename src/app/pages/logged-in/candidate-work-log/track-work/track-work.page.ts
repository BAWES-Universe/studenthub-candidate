import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//pages 
import { LogTimeManuallyPage } from '../log-time-manually/log-time-manually.page';
import { EndSessionPage } from '../end-session/end-session.page';


@Component({
  selector: 'app-track-work',
  templateUrl: './track-work.page.html',
  styleUrls: ['./track-work.page.scss'],
})
export class TrackWorkPage implements OnInit {

  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async toggleTrack() {
    
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: EndSessionPage, 
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal end-session-modal",
      componentProps: { 
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

  async addManually() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: LogTimeManuallyPage, 
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal track-manual-modal",
      componentProps: { 
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
  

}
