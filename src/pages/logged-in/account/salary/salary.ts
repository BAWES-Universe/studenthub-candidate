import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

// Providers
import { AccountService } from '../../../../providers/logged-in/account.service';

// Models
import { Salary } from '../../../../models/salary';

@Component({
  selector: 'page-salary',
  templateUrl: 'salary.html'
})
export class SalaryPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public salaries: Salary[];
  
  constructor(
    public navCtrl: NavController,
    public accountService: AccountService,
    private _loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    // this.loadData();   
  }
  ionViewWillEnter() {
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.accountService.listSalary(page).subscribe(response => {

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

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }
}
