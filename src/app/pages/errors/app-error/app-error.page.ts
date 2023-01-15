import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, LoadingController, ModalController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


import { Preferences as Storage } from '@capacitor/preferences';

@Component({
  selector: 'pogi-app-error',
  templateUrl: './app-error.page.html',
  styleUrls: ['./app-error.page.scss'],
})
export class AppErrorPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    window.analytics.page('App Error page');
  }

  ionViewWillEnter() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss();
      }
    });

    this.loadingCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss();
      }
    });
  }

  /**
   * Open home page
   */
  async home() {

    Storage.get({ key: 'loggedInUser' }).then(ret => {

      this.navCtrl.navigateRoot('/');
      
    }).catch(r => {

      this.toastCtrl.create({
        message: this.translateService.transform('Please, enable cookies/ storage.'),
        duration: 3000,
        cssClass: 'error_toast_' + this.translateService.direction()
      }).then(toast => toast.present());
    });
  }
}
