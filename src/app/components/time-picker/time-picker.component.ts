import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  public time;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

  onChange(event) {
    console.log(event);
  }

  save() {
    this.dismiss(this.time)
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
