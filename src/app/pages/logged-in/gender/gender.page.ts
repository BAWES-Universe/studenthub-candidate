import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-gender',
  templateUrl: './gender.page.html',
  styleUrls: ['./gender.page.scss'],
})
export class GenderPage implements OnInit {

  public isLoading;

  public candidate: Candidate;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
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

    this.accountService.updateGender(answer).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_gender = answer;

        this.dismiss();
      } else {
        this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
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
