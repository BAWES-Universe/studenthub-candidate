import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


@Component({
  selector: 'app-name',
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage implements OnInit {

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  @ViewChild('inptName', { static: false }) inptName: IonInput;

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this._initForm();

    setTimeout(() => {
      this.inptName.setFocus();
    }, 500);
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      name: [this.candidate.candidate_name, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  submit() {
    this.isLoading = true; 

    this.accountService.updateName(this.form.value.name).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {
        this.candidate.candidate_name = this.form.value.name;
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
