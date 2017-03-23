import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

// Page Imports
import { HomePage } from '../home/home';
import { TransferListPage } from '../../../pages/transfer/transfer-list/transfer-list';

// Services
import { AuthService } from '../../../providers/auth.service';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})
export class NavigationPage {

  rootPage: any = HomePage;

  @ViewChild('loggedInContent') nav: NavController

  constructor(
    private _auth: AuthService,
    private _menuCtrl: MenuController
  ){}

   loadPage(pageName: string) {
    switch (pageName) {
      case "transfer":
        this.rootPage = TransferListPage;
        break;
    }
    this._menuCtrl.close();
  }

  /**
   * Log Agent out of the app
   */
  logout(){
    this._auth.logout();
  }

}
