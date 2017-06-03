import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController,AlertController } from 'ionic-angular';

// Providers
import { AccountService } from '../../../../providers/logged-in/account.service';
import { StatisticService } from '../../../../providers/logged-in/statistic.service';

// Models
import { Salary } from '../../../../models/salary';

//Popover
import { PopoverContentPage } from '../popover/popover';

@Component({
  selector: 'page-salary',
  templateUrl: 'salary.html'
})
export class SalaryPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public statistics: any;
  public salaries: Salary[];
  
  constructor(
    public navCtrl: NavController,
    public statisticService: StatisticService,
    public popoverCtrl: PopoverController,
    public accountService: AccountService,
    private _loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {     this.statisticService.get().subscribe(response => {
      this.statistics = response;
      });}

  ionViewDidLoad() {
    // this.loadData();   
  }
  ionViewWillEnter() {
    this.loadData(this.currentPage);
  }


  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param myEvent
   */
  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverContentPage);
    popover.present({
      ev: myEvent
    });
  }

  /**
   * Load list of transfers
   * @param page 
   * @param refresher 
   */
  loadData(page: number, refresher: any = null) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.accountService.listSalary(page).subscribe(response => {

      if(refresher){
        refresher.complete();
      }

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.salaries = response.json();
    },
    error=>{},
    ()=>{loader.dismiss();}
    );
  }

  doRefresh($event) {
    this.loadData(this.currentPage, $event);
  }

  pageLinkColor(page: number) {
    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }
}
