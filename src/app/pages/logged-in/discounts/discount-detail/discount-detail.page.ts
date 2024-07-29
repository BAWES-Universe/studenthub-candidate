import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
//models
import { Discount } from '../../../../models/discount';
//services
import { TranslateLabelService } from '../../../../providers/translate-label.service';


@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.page.html',
  styleUrls: ['./discount-detail.page.scss'],
})
export class DiscountDetailPage implements OnInit {

  model: Discount;

  constructor(
    public translateService: TranslateLabelService,
    public platform: Platform,
    public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
