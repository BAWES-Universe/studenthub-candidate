import { Component } from '@angular/core';
import { ViewController,NavController } from 'ionic-angular';
import { AuthService } from '../../../../providers/auth.service';

import {ChangePassword} from '../change-password/change-password'
@Component({
  templateUrl: 'popover.html'
})

export class PopoverContentPage {
constructor(
  public navCtrl: NavController,
  private _auth: AuthService,
  public viewCtrl: ViewController) {}

  loadChangePassword(){
    // Load change password page
    this.navCtrl.push(ChangePassword);
  }
  /**
   * Log Agent out of the app
   */
  logout(){

    this._auth.logout();
        this.viewCtrl.dismiss();
    
  }

  
}