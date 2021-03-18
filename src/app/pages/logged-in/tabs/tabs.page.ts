import { Component, OnInit } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
//pages
import { OptionPage } from '../option/option.page';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public showHeader: boolean = false;
  public invitationCount = null;

  constructor(
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this.eventService.tabScrolled$.subscribe(data => {
      this.showHeader = (data['scrollTop'] > 0);
    });

    this.eventService.invitations$.subscribe(data => {
      this.invitationCount = data;
    });
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
