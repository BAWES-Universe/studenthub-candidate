import { Component, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
//pages 
import { LogTimeManuallyPage } from '../log-time-manually/log-time-manually.page';
import { EndSessionPage } from '../end-session/end-session.page';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-track-work',
  templateUrl: './track-work.page.html',
  styleUrls: ['./track-work.page.scss'],
})
export class TrackWorkPage implements OnInit {

  public started;

  public loading: boolean = false;
  public savingHours: boolean = false; 
  public startingWork: boolean = false; 

  public currentPage; 
  public totalCount;
  public pageCount;
  public candidateWorkingHourData = [];

  public today; 

  public stats: any;
 
  constructor(
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public candidateWorkingHour: CandidateWorkingHourService,
  ) { }

  ngOnInit() {
    if (this.authService && this.authService.isLogin && this.authService.candidate && this.authService.candidate.isWorking) {
      this.started = this.authService.candidate.isWorking.start_time;
    }

    this.eventService.workStopped$.subscribe((data) => {
      this.started = null;
    });

    this.today = new Date();

    this.checkStatus();
    this.loadSessions();
    this.loadStats();
  }

  checkStatus() { 
    this.accountService.checkWorkStatus().subscribe((data: any) => {
      if (data) {
        this.started = data.start_time;
      }
    });
  }

  getUrlParams() { 
    return "&date=" + format(parseISO(this.today.toISOString() ), 'yyyy-MM-dd');
  }

  handleRefresh(event) {
    this.checkStatus();
    this.loadSessions();
    this.loadStats();
    event.target.complete();
  }

  loadStats() {
    this.candidateWorkingHour.stats(this.getUrlParams()).subscribe(response => {
       this.stats = response;
    });
  }

  loadSessions() {
    this.loading = true;
    
    this.candidateWorkingHour.listHours(1, this.getUrlParams()).subscribe(response => {
      
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
    }, error => { },
    () => {
      this.loading = false;
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.candidateWorkingHour.listHours(this.currentPage, this.getUrlParams()).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingHourData = this.candidateWorkingHourData.concat(response.body);
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  async stopWork() {
      
    this.savingHours = true;

    let locationOptions = { enableHighAccuracy: false, timeout: 5000, maximumAge: 1200 };

    Geolocation.getCurrentPosition(locationOptions).then(resp => {
 
      if (resp && resp.coords) {

        this.accountService.stopWork(resp.coords.latitude, resp.coords.longitude).subscribe(data => {
          this.authService.candidate.isWorking = null;
          this.authService.saveLoggedInUser();
          
          this.eventService.workStopped$.next({});

          this.started = null;
          this.loadSessions(); 
          this.loadStats();
          //this.checkStatus();
        });
      }

      this.savingHours = false;

    }).catch((error) => {
     
      this.savingHours = false;

      console.log(error);

      this.alertCtrl.create({
        message: this.translateService.transform('Location permission required to save the work'),
        buttons: [
          this.translateService.transform("Okay")
        ]
      }).then(alert => alert.present());
    });
  }

  startWork() {

    this.startingWork = true; 

    let locationOptions = { enableHighAccuracy: false, timeout: 5000, maximumAge: 1200 };

    Geolocation.getCurrentPosition(locationOptions).then(resp => {
       
      if (resp && resp.coords) {

        this.accountService.startWork(resp.coords.latitude, resp.coords.longitude).subscribe(data => {

          if (data.operation == "success") {
            this.authService.candidate.isWorking = data.data;
            this.authService.saveLoggedInUser();
            this.checkStatus()
            this.loadStats();
          } 
        });
      }

      this.startingWork = false; 

    }).catch((error) => {
       
      this.startingWork = false; 

      this.alertCtrl.create({
        message: this.translateService.transform('Location permission required to start the work'),
        buttons: [
          this.translateService.transform("Okay")
        ]
      }).then(alert => alert.present());
    });
  }

  async toggleTrack() {
    
    if (this.started) {
      this.confirmStopWork();
    } else {
      this.startWork();
    }
  }

  async confirmStopWork() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: EndSessionPage, 
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal end-session-modal",
      componentProps: { 
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      this.started = null; 

      if (e.data && e.data.submit) {
        this.stopWork();
      } else if (e.data && e.data.discard) {
        this.discardSession();
      }
    });
    modal.present();
  }

  discardSession() {
    this.accountService.discardSession().subscribe(data => {
      this.authService.candidate.isWorking = null;
      this.authService.saveLoggedInUser();
      this.eventService.workStopped$.next({}); 
    });
  }

  async addManually() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: LogTimeManuallyPage, 
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal track-manual-modal",
      componentProps: { 
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
  
  secondsToTime(secs){
    var h = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var m = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var s = Math.ceil(divisor_for_seconds);

    return `${h?`${h}:`:""}${m?`${m}:${s}`:`${s}s`}`
  }
}
