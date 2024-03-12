import { Component, OnInit } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
//pages
import { OptionPage } from '../option/option.page';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public showHeader: boolean = false;

  constructor(
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public authService: AuthService,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this.eventService.tabScrolled$.subscribe(data => {
      this.showHeader = (data['scrollTop'] > 0);
    });

    this.loadJobSearchStatus();
  }

  ngOnDestroy() {

  }
  
  /**
   * load job search status ,.
   */
   async loadJobSearchStatus() {

    this.authService.loadingJobSearchStatus = true;

    this.accountService.getJobSearchStatus().subscribe(res => {

      this.authService.candidate_job_search_status = res.candidate_job_search_status;

      this.authService.store = res.store;

      this.authService.company = (res.parent_company) ? res.parent_company : res.company;

      /*if(!res.isProfileCompleted) {

        this.authService.isProfileCompleted = false;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/complete-profile']);
      }*/

      this.authService.loadingJobSearchStatus = false;
    }, () => {
      this.authService.loadingJobSearchStatus = false;
    });
  }
}
