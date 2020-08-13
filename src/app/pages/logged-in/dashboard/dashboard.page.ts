import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public candidate_job_search_status: any;

  public updating: boolean = false;

  public loading: boolean = false;
  
  public store;

  public company; 
  
  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public eventService: EventService,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  /**
   * load job search status 
   */
  async loadData() {
    this.loading = true; 

    this.accountService.getJobSearchStatus().subscribe(res => {
      
      this.candidate_job_search_status = res.candidate_job_search_status;

      this.store = res.store;
      this.company = res.company;

      /*if(!res.isProfileCompleted) {

        this.authService.isProfileCompleted = false;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/complete-profile']);
      }*/

      this.loading = false;
    }, () => {
      this.loading = false;
    })
  }

  /**
   * set oneSignal subscription
   */
  setSubscription() {
    this.eventService.setOneSignal$.next();
  }

  /**
   * update job search status
   */
  updateJobSearchStatus() {

    let params = {
      job_search_status: this.candidate_job_search_status == 1? 0: 1
    };

    this.updating= true; 

    this.candidate_job_search_status = params.job_search_status;

    this.accountService.updateJobSearchStatus(params).subscribe(data => {

      this.updating= false; 

      if(data.operation != 'success') {
        this.candidate_job_search_status = !params.job_search_status;//back to old status
      }
    }, () => {
      this.updating= false;
    });
  }

  getFirstName() {
    const FullName = this.authService.name.split(' ');
    return (FullName[0]) ? FullName[0] : this.authService.name;
  }
}

