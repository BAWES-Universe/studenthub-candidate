import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

// Page Imports
import { HomePage } from '../home/home';
import { SalaryPage } from '../account/salary/salary';
import { EmployerPage } from '../account/employer/employer';
import { ChangePassword } from '../account/change-password/change-password'; 

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
      case "summary":
        this.rootPage = HomePage;
        break;
      case "salary":
        this.rootPage = SalaryPage;
        break;
      case "employer":
        this.rootPage = EmployerPage;
        break;  
      case "change-password":
        this.rootPage = ChangePassword;
        break;  
    }
    this._menuCtrl.close();
  }

  /**
   * Log Agent out of the app
   */
  logout(){
    this._auth.logout('Navigation Logout');
  }

}
