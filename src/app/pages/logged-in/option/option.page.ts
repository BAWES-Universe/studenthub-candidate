import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
//services
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  constructor(
    public authService: AuthService,
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  /**
   * close popup
   */
  dismiss() {
    this.popoverCtrl.dismiss();
  }

  /**
   * Log Agent out of the app
   */
  logout() {
    this.authService.logout();
    this.popoverCtrl.dismiss();
  }
}
