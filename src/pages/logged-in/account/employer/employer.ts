import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

// Providers
import { AccountService } from '../../../../providers/logged-in/account.service';

// Models
import { Employer } from '../../../../models/employer';

@Component({
  selector: 'page-employer',
  templateUrl: 'employer.html'
})
export class EmployerPage {

  public employer: Employer[];

  constructor(
    public navCtrl: NavController,
    public accountService: AccountService,
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
    this.accountService.employer().subscribe(response => {
      this.employer = response;
      loader.dismiss();
    });
  }


}
