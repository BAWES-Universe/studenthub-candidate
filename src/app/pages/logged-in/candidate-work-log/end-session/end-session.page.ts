import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-end-session',
  templateUrl: './end-session.page.html',
  styleUrls: ['./end-session.page.scss'],
})
export class EndSessionPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
