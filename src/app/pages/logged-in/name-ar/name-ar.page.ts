import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


@Component({
  selector: 'app-name-ar',
  templateUrl: './name-ar.page.html',
  styleUrls: ['./name-ar.page.scss'],
})
export class NameArPage implements OnInit {

  public isLoading: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  @ViewChild('inptName', { static: false }) inptName: IonInput;

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
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
      name_ar: [this.candidate.candidate_name_ar, Validators.required],
    });
  }

  /**
   * save arabic name
   */
  submit() {
    this.isLoading = true; 

    this.accountService.updateNameAr(this.form.value.name_ar).subscribe(res => {

      this.isLoading = false;

      if(res.operation == 'success') {
        this.candidate.candidate_name_ar = this.form.value.name_ar;
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
