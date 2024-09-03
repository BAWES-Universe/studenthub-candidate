import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AlertController, IonContent, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
//models 
import { ChatMessage } from "../../../../models/chat-message";
import { Chat } from "../../../../models/chat";
//services
import { EventService } from "../../../../providers/event.service";
import { TranslateLabelService } from "../../../../providers/translate-label.service";
import { AwsService } from "../../../../providers/logged-in/aws.service";
import { AuthService } from "../../../../providers/auth.service";
import { ChatService } from "../../../../providers/logged-in/chat.service";
import { AnalyticsService } from '../../../../providers/analytics.service';


@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.page.html',
  styleUrls: ['./chat-view.page.scss'],
})
export class ChatViewPage implements OnInit {

  // File input used for browser fallback when no capacitor is available
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild('panel1', { static: false }) panel1: ElementRef;

  public scrollPosition: number = 0;

  public loadingMoreMessages: boolean = false;

  public checkingNewMessages: boolean = false;

  public haveUnreadMessage: boolean = false;

  public isMobile = false;

  public noMessages = false;

  public from = null;

  public sendingMessage;
  public txtMessage;

  public chat: Chat;
  public loading = false;
  public chat_uuid: string;

  public showHeader = false;

  public isScrolledToBottom: boolean = false;

  public candidate_mute_chat: boolean;

  messageGroups: any;

  public messageSubscription;

  public lastMessage; //last message uuid

  public messages: ChatMessage[] = [];

  public doInfiniteMessagesSubscription: Subscription;

  public newMessagesSubscription: Subscription;

  public loadMessagesSubscription: Subscription;

  public loadConverastionSubscription: Subscription;

  public sendMessageSubscription: Subscription;

  public filePickerSubscription: Subscription;

  public browserUploadSubscription: Subscription;

  public markReadSubscription: Subscription;

  public updateStatusSubscription: Subscription;

  public completed: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _loadingCtrl: LoadingController,
    public _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public eventService: EventService,
    public platform: Platform,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService,
    public awsService: AwsService,
    private _auth: AuthService,
    public chatService: ChatService,
    public router: Router,
    public datepipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.analyticsService.page('Chat View page');
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Chat View page'
    });
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }
  }

  ngOnDestroy() {
    if (!!this.doInfiniteMessagesSubscription) {
      this.doInfiniteMessagesSubscription.unsubscribe();
    }

    if (!!this.newMessagesSubscription) {
      this.newMessagesSubscription.unsubscribe();
    }

    if (!!this.loadMessagesSubscription) {
      this.loadMessagesSubscription.unsubscribe();
    }

    if (!!this.loadConverastionSubscription) {
      this.loadConverastionSubscription.unsubscribe();
    }

    if (!!this.sendMessageSubscription) {
      this.sendMessageSubscription.unsubscribe();
    }

    if (!!this.filePickerSubscription) {
      this.filePickerSubscription.unsubscribe();
    }

    if (!!this.browserUploadSubscription) {
      this.browserUploadSubscription.unsubscribe();
    }

    if (!!this.markReadSubscription) {
      this.markReadSubscription.unsubscribe();
    }

    if (!!this.updateStatusSubscription) {
      this.updateStatusSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.content.scrollToPoint(0, this.scrollPosition);

    const state = window.history.state;

    this.chat = state['chat'];

    if (!this.chat_uuid)
      this.chat_uuid = this.activatedRoute.snapshot.paramMap.get('chat_uuid') + "";

    if (state && state['from']) {
      this.from = state['from'];
    }

    if (this._auth.isLogin) {
      this.loadMessages(true);//scroll to bottom 

      this.markRead();//on view enter

      if (!this.chat) {
        this.loadData();
      }

      if (!this.messageSubscription) {
        this.messageSubscription = interval(5 * 1000).subscribe(x => {
          this.checkNewMessage(); // no need to scroll every time
        });
      }

      this.eventService.alertUpdate$.next({});
    }
  }

  /**
   * Check new message
   */
  async checkNewMessage(scrollToBottom = false) {

    if (this.loading || this.loadingMoreMessages || this.checkingNewMessages)
      return false;

    let latest_message_index;

    if (this.messages.length > 0)
      latest_message_index = this.messages[this.messages.length - 1].message_index;


    this.newMessagesSubscription = this.chatService.newMessages(this.chat_uuid, latest_message_index).subscribe(response => {

      /*this.content.getScrollElement().then(ele => {  
          
          //if scrolled to top 

          if(ele.scrollTop - ele.scrollHeight > 570) {

          }
      });*/

      if (response.length == 0)
        return;

      for (let message of this.messages) {
        if (message.chat_message_uuid == response[0].chat_message_uuid) {
          return false;//duplicate message fetched 
        }
      }

      for (let message of response.reverse()) {
        this.messages.push(message);
      }

      this.processMessageList();

      // if it was at bottom or new message sent, then move to bottom and mark as read

      if (this.isScrolledToBottom || scrollToBottom) {
        this.markRead();
        this.scrollToBottom();

        //if latest messages from agent(s)

      } else if (response.length > 0 && response[0]['message_sender_type'] == 1) {
        this.haveUnreadMessage = true;// show alert for new message
      }
    });
  }

  /**
   * on scroll to top 
   * @param e 
   */
  onScroll(e) {
    //on top 100px and scrolling to top

    if (e.detail.currentY < 100 && e.detail.deltaY < 0) {
      this.doInfiniteMessages();
    }

    this.content.getScrollElement().then(ele => {
      this.isScrolledToBottom = (ele.scrollTop == ele.scrollHeight - ele.clientHeight);
    });

    this.haveUnreadMessage = false;
  }

  /**
   * processs message response to show messages separated by date 
   */
  processMessageList() {

    //sort by message_index 

    this.messages.sort((a, b) => {
      return a.message_index - b.message_index;
    });

    const messageGroups = {};

    for (const message of this.messages) {

      // const date = message.message_created_formatted;
      const date = this.datepipe.transform(
        this.toDate(message.created_at), 'yyyy-MM-dd', undefined, 
        this.translateService.currentLang
      ) + "";

      if (messageGroups[date]) {
        messageGroups[date].messages.push(message);
      } else {
        messageGroups[date] = {
          date: date,
          messages: [message]
        };
      }
    }

    this.messageGroups = Object.keys(messageGroups).map(k => messageGroups[k]);
  }

  /**
   * loading more messages on scroll to top 
   */
  async doInfiniteMessages() {

    if (this.completed) {
      return false;
    }

    if (this.loading || this.loadingMoreMessages || this.checkingNewMessages)
      return false;

    this.loadingMoreMessages = true;

    let last_message_index;

    if (this.messages.length > 0) {
      last_message_index = this.messages[0].message_index;
    } else {
      return false; //doInfiniteMessages will be called only to load older messages 
    }

    let a = document.getElementById('messages-wrapper') as HTMLElement;

    let originalHeight = a.clientHeight;

    this.doInfiniteMessagesSubscription = this.chatService.messages(this.chat_uuid, last_message_index).subscribe(response => {

      this.loadingMoreMessages = false;
      this.messages = response.reverse().concat(this.messages);

      if (response.length == 0) {
        this.completed = true;
      }

      this.processMessageList();

      this.content.getScrollElement().then(ele => {
        ele.scrollTop += a.clientHeight - originalHeight;
      });
    });
  }

  /**
   * Load messages
   */
  async loadMessages(scrollToBottom = false) {

    if (this.loading || this.loadingMoreMessages || this.checkingNewMessages)
      return false;

    this.loading = true;

    this.loadMessagesSubscription = this.chatService.messages(this.chat_uuid).subscribe(response => {
      this.loading = false;

      this.messages = response.reverse();

      this.processMessageList();

      if (scrollToBottom) {
        this.scrollToBottom();
      }

      if (this.messageGroups.length == 0) {
        this.noMessages = true;
      } else {
        this.noMessages = false;
      }

      //mark as read on message got loaded

      this.markRead();
    });
  }

  /**
   * scroll page to bottom 
   */
  scrollToBottom() {
    setTimeout(_ => {
      this.content.scrollToBottom();
    }, 100);
  }

  /**
   * Load chat
   */
  async loadData() {
    this.loadConverastionSubscription = this.chatService.view(this.chat_uuid).subscribe(response => {
      this.loading = false;
      this.chat = response;
    });
  }

  /**
   * Send message to chat
   */
  async sendMessage() {

    if (!this.txtMessage) {
      return null;
    }

    this.sendingMessage = true;

    // mark messages as read when candidate reply

    this.markRead();

    this.sendMessageSubscription = this.chatService.sendMessage(
      this.chat_uuid,
      this.txtMessage
    ).subscribe(response => {

      this.sendingMessage = false;

      if (response.operation == 'success') {

        this.checkNewMessage(true); // load new message and scroll

        this.txtMessage = null;
      }
      else {
        this._alertCtrl.create({
          message: this.translateService.errorMessage(response.message),
          buttons: [this.translateService.transform('Ok')]
        }).then(prompt => prompt.present());
      }
    }, err => {
      this.sendingMessage = false;
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/') + ' UTC');
  }

  /**
   * mark all messages as read
   */
  markRead() {
    this.haveUnreadMessage = false;
    this.markReadSubscription = this.chatService.markRead(this.chat_uuid).subscribe();
  }

  goBack() {
    this.router.navigate(['view/chat-list']);
  }

  showNewMsgBar() {
    return (this.platform.height() - 150) < this.panel1.nativeElement.clientHeight;
  }

  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }
}
