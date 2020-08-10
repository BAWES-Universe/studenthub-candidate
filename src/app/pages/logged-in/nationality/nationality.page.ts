import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AlertController, ModalController} from '@ionic/angular';
//services
import { CountryService } from 'src/app/providers/country.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//models
import { Candidate } from 'src/app/models/candidate';
import { Country } from 'src/app/models/country';
import {AccountService} from "../../../providers/logged-in/account.service";


@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.page.html',
  styleUrls: ['./nationality.page.scss'],
})
export class NationalityPage implements OnInit {

  public candidate: Candidate;

  public currentPage = 1;

  public totalPage = 0;

  public query: string = '';

  public countries: Country[];

  public countryList: Country[];

  public loading: boolean = false;
  public saving = false;

  public updatingNationality = false;

  public doInfiniteSubscription: Subscription;
  public updateSubscription: Subscription;
  public countrySubscription: Subscription;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public countryService: CountryService,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  onSearchInput(ev: any) {
    this.query = ev.target.value;
    if (this.countryList) {
      this.countries = this.countryList.filter(item => {
        return (
          item.country_name_en.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
          item.country_name_ar.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1
        );
      });
    }
  }

  loadData(page: number) {

    // Load list of country

    this.loading = true;

    this.countrySubscription = this.countryService.filter(this.query).subscribe(response => {

      this.countries = response;
      this.countryList = response;
    },
      error => { },
      () => {
        this.loading = false;
      });
  }

  /**
   * Infinite scroll functionality
   * @param event
   */
  doInfinite(event) {

    if (this.currentPage == this.totalPage) {
      if (event && event.target) {
        return event.target.complete();
      }
    }

    this.currentPage++;

    this.doInfiniteSubscription = this.countryService.filter(this.query).subscribe(response => {
      for (const country of response) {
        this.countries.push(country);
      }
      if (event && event.target) {
        event.target.complete();
      }
    });
  }

  /**
   * close modal
   * @param data 
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }

  /**
   * on country selection
   * @param country
   */
  async rowSelected(country: Country) {
    this.saving = true;
    this.candidate.country_id = country.country_id;
    this.candidate.country = country;

    this.accountService.updateNationality(country.country_id).subscribe(async response => {
      this.saving = false;

      if (response.operation != 'success') {
        let alert = await this.alertCtrl.create({
          message: this.translateService.errorMessage(response.message),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      } else  {
        this.dismiss();
      }
    });
  }
}
