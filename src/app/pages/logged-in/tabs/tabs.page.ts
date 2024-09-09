import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
//pages
//import { OptionPage } from '../option/option.page';
import { ChatService } from 'src/app/providers/logged-in/chat.service';
import { ChatViewPage } from '../chat/chat-view/chat-view.page';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public showHeader: boolean = false;

  public alerts: number = 0;
  
  public startingChat: boolean = false; 

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public eventService: EventService,
    public chatService: ChatService,
    public authService: AuthService,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this.eventService.tabScrolled$.subscribe(data => {
      this.showHeader = (data['scrollTop'] > 0);
    });


    this.eventService.alertCount$.subscribe((
      counts : {
        total,
        pendingInvitations
      }
    ) => {
      if(!counts)
        return null; 
        
      this.alerts = counts.total > 0 ? counts.total : null;
    });

    

    this.loadJobSearchStatus();
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


  startChat() {
    this.startingChat = true; 

    this.chatService.startChat().subscribe(async res => {
      this.startingChat = false; 
    
      if (res.operation == "error") {
        let prompt = await this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        });
        return prompt.present();
      }
      else 
      {
        //this.navCtrl.navigateForward('/chat-view/' + res.chat.chat_uuid);

        window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

        const modal = await this.modalCtrl.create({
          component: ChatViewPage,
          cssClass: 'popup-modal',
          componentProps: {
            chat_uuid: res.chat.chat_uuid
          }
        });
        modal.onDidDismiss().then(e => {

          if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
          }
        });
        modal.present();
      }
    });
  }
}
