import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-driving-license',
  templateUrl: './driving-license.page.html',
  styleUrls: ['./driving-license.page.scss'],
})
export class DrivingLicensePage implements OnInit {

  public isLoading;

  public candidate: Candidate;

  constructor(
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public accountService: AccountService
  ) { }

  ngOnInit() {
  }

  /**
   * save arabic name
   */
  submit(answer) {
    this.isLoading = answer; 

    this.accountService.updateDrivingLicense(answer).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_driving_license = answer;

        this.dismiss();
      }
    }, () => {
      this.isLoading = false;
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
}
