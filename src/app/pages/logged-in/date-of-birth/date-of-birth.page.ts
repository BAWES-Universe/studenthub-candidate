import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, Platform, AlertController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-date-of-birth',
  templateUrl: './date-of-birth.page.html',
  styleUrls: ['./date-of-birth.page.scss'],
})
export class DateOfBirthPage implements OnInit {

  public min; //min date
  public max;//max date 

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  constructor(
    public platform: Platform,
    public _fb: FormBuilder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    window.analytics.page('Date of birth page');

    this.min = '1960/01/01';

    let d = new Date();
    //d.setMonth(d.getMonth() - 12 * 16);//atleast 16 years old 

    //to fix: https://www.pivotaltracker.com/story/show/170663720

    if (this.platform.is('mobile') && !this.candidate.candidate_birth_date) {
        this.max = (d.getFullYear() - 16) + '-01-01';
    } else {
        this.max = d;
    }

    this._initForm();
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      birth_date: [this.candidate.candidate_birth_date, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  submit() {
    this.isLoading = true;
    this.candidate.candidate_birth_date = this.form.value.birth_date;
    this.accountService.updateBirthDate(this.form.value.birth_date).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {

        this.candidate.candidate_birth_date = res.candidate_birth_date;
        
      } else {
        this.alertCtrl.create({
          message: this.authService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    }, () => {
      this.isLoading = false;
    });
    this.dismiss();
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
