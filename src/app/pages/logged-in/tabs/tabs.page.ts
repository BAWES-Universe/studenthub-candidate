import { Component, OnInit } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//pages
import { OptionPage } from '../option/option.page';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public _translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }

  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: OptionPage,
      event: e
    });
    popover.present();
  }
}
