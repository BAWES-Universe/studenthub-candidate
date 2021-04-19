import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  public company: Company;

  public slideOpts = {
    // Default parameters
    slidesPerView: 10,
    spaceBetween: 10,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 40
      },
      // when window width is >= 950px
      950: {
        slidesPerView: 6,
        spaceBetween: 40
      }
    }
  };

  constructor(
    public awsService: AwsService,
    public translateService: TranslateLabelService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() { 
  } 

  dismiss() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss();
      }
    });
  }

  setNull() {
    this.company.company_logo = null;
  }
}
