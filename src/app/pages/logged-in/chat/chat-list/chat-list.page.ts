import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
//models
import { Chat } from "../../../../models/chat";
// services
import { TranslateLabelService } from '../../../../providers/translate-label.service';
import { AnalyticsService } from "../../../../providers/analytics.service";
import { ChatService } from "../../../../providers/logged-in/chat.service";
import { EventService } from '../../../../providers/event.service';
import { AwsService } from "../../../../providers/logged-in/aws.service";


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition: number = 0;

  public chats: Chat[] = [];

  public total = 0; // total unread message count

  public pageCount = 0;
  public currentPage = 1;

  public loading = false;
    
  constructor(
    public aws: AwsService,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public chatService: ChatService,
    public eventService: EventService,
    public router: Router,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.eventSubscriptions();
  }

  /**
   * Refresh job listing
   * @param refresher
   */
  doRefresh(refresher = null) {
    this.loadChatData();
  }

  ionViewDidEnter() {

    //if no chats loaded 

    if (this.chats.length == 0)
      this.loadChatData();
 
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
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
   * Load chat list
   */
  async loadChatData() {

    this.loading = true;

    this.chatService.list(this.currentPage, {}).subscribe(response => {
      
      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.chats = response.body;
    },
      () => {
        this.loading = false;
      });
  }

  /**
   * Method perform infinite scroll which
   * will load more data just like pagination
   */
  async doInfinite(event) {

    if (this.currentPage >= this.pageCount) {
      return event.target.complete();
    }

    this.currentPage += 1;

    this.chatService.list(this.currentPage, {}).subscribe(response => {
       
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.chats = this.chats.concat(response.body);

      event.target.complete();
    },
    () => {
      event.target.complete();
    });
  }

  /**
   * open chat detail page
   * @param converstaion
   */
  public detail(converstaion) {
    this.router.navigate(['chat-view', converstaion.chat_uuid], {
      state: {
        'chat': converstaion
      }
    });
  }

  public eventSubscriptions() {
    this.eventService.alertCount$.subscribe((data: any) => {

      /**
       * on new message refresh list
       */
      if (data && data.total != this.total) {

        this.total = data.total; // total unread messages

        this.currentPage = 1;

        this.loadChatData();
      }

      if (!this.chats) {
        return null;
      }

      this.chats.forEach(element => {

        if (data[element.chat_uuid]) {
          element.candidateUnreadCount = data[element.chat_uuid].candidateUnreadCount;
          element.recentMessage = data[element.chat_uuid].recentMessage;
        }
      });

      this.chats.sort((a: any, b: any) => {
        return b.unreadMessageCount - a.unreadMessageCount;
      });
    });
  }

  onLogoError(company) {
    company.company_logo = null;
  }
}

