import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-log-time-manually',
  templateUrl: './log-time-manually.page.html',
  styleUrls: ['./log-time-manually.page.scss'],
})
export class LogTimeManuallyPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
