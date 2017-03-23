import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

// Providers
import { AssignedService } from '../../../providers/logged-in/assigned.service';
// Models
import { Assigned } from '../../../models/assigned';

@Component({
  selector: 'page-assigned-list',
  templateUrl: 'assigned-list.html'
})
export class AssignedListPage {

  public assigned: Assigned[];

  constructor(
    public navCtrl: NavController,
    public assignedService: AssignedService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
  ) {


  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    // Load list of candidate
    let loader = this._loadingCtrl.create();
    loader.present();
    this.assignedService.list().subscribe(response => {
      this.assigned = response;
      loader.dismiss();
    });
  }


}
