import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
//models
import { Candidate } from 'src/app/models/candidate';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public videoInterval;

  public submitting: boolean = false;

  public loading: boolean = false;

  public update;

  public candidate: Candidate;

  public pendingFields = '';
 
  constructor( 
    public navCtrl: NavController, 
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,  
    public translateService: TranslateLabelService, 
    public analyticsService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticsService.page('Complete Profile page');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;

    this.accountService.profile().subscribe(async res => {
      this.candidate = res;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  translate() {

    const code = this.translateService.currentLang != 'ar' ? 'ar' : 'en';

    this.eventService.setLanguagePref$.next(code);

    if (this.authService.isLogin) {
      this.accountService.setLanguagePref(code).subscribe();
    }
  }

  /**
   * open dashboard
   */
  async submit() {
    this.authService.isProfileCompleted = true;
    this.authService.saveLoggedInUser();

    this.navCtrl.navigateRoot(['/']);
  }
}
