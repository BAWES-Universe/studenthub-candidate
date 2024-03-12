import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 
import { IonContent } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition: number = 0;

  handler;

  constructor( 
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public router: Router
  ) { }

  ngOnInit() {
    this.analyticsService.page('No Internet Page');

    if (navigator.onLine) {
      return this.refresh();
    }

    this.handler = _ => { 
      this.refresh();
    };

    window.addEventListener('online', this.handler);
  }

  ngOnDestroy() {

  }
  
  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'No Internet Page'
    });
 
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  
    window.removeEventListener('online', this.handler);
  }

  /**
   * Open navigation page to check internet connectivity 
   */
  refresh() {
    this.router.navigate(['/']);
  }
}

