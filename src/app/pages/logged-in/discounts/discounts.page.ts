import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
//services
import { TranslateLabelService } from '../../../providers/translate-label.service';
import { DiscountCategoryService } from '../../../providers/logged-in/discount-category.service';
import { DiscountService } from '../../../providers/logged-in/discount.service';
import { AwsService } from "../../../providers/logged-in/aws.service";
//models
import { Discount } from '../../../models/discount';
import { DiscountCategory } from '../../../models/discount-category';
//pages
import { DiscountDetailPage } from './discount-detail/discount-detail.page';


@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
})
export class DiscountsPage implements OnInit {

  public discounts: Discount[] = [];
  public discountCategories: DiscountCategory[] = [];

  public loading = false;

  public totalCount = 0;
  public pageCount = 0;
  public currentPage = 1;

  public filters: {
    category_id: null | number
  } = {
    category_id: null
  };

  constructor(
    public modalCtrl: ModalController,
    public aws: AwsService,
    public discountService: DiscountService,
    public discountCategoryService: DiscountCategoryService,
    public translateService: TranslateLabelService,
    public platform: Platform,

  ) { }

  ngOnInit() {
    this.loadCategories();

    this.loadData(1);
  }

  loadCategories() {
    this.discountCategoryService.list(-1).subscribe(response => {
      this.discountCategories = response.body;
    });
  }

  /**
   * load data
   * @param page
   */
  async loadData(page: number, silent = false) {

    if (!silent) {
      this.loading = true;
    }

    this.discountService.list(page, this.getUrlParams()).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.discounts = response.body;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.currentPage++;

    this.loading = true;

    this.discountService.list(this.currentPage, this.getUrlParams()).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.discountCategories = this.discountCategories.concat(response.body);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  public getUrlParams() {

    let url = "";

    if (this.filters.category_id) {
      url += "&category_id=" + this.filters.category_id;
    }

    return url;
  }

  resetCategorySelected() {
    this.filters.category_id = null;
    this.discounts = [];
    this.loadData(1);
  }

  onCategorySelected(model: DiscountCategory) {
    this.filters.category_id = model.category_id;
    this.discounts = [];
    this.loadData(1);
  }

  async onSelected(model: Discount) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: DiscountDetailPage,
      componentProps: {
        model: new DiscountCategory()
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

  errorLogo(event, discount) {
    discount.company.company_logo = null;
  }

  errorImage(event, discount) {
    discount.image = null;
  }
}
