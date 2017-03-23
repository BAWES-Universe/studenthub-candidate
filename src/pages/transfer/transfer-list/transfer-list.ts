import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from 'ionic-angular';

// Providers
import { TransferService } from '../../../providers/logged-in/transfer.service';
// Models
import { Transfer } from '../../../models/transfer';

@Component({
  selector: 'page-transfer-list',
  templateUrl: 'transfer-list.html'
})
export class TransferListPage {
  public transfer: Transfer[];
  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,

    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.list().subscribe(response => {
      this.transfer = response;
      loader.dismiss();
    });
  }

}
