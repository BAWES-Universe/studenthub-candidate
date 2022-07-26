import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { Invitation } from 'src/app/models/invitation';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import {EventService} from "../../../providers/event.service";


@Component({
  selector: 'app-invitation-feedback',
  templateUrl: './invitation-feedback.page.html',
  styleUrls: ['./invitation-feedback.page.scss'],
})
export class InvitationFeedbackPage implements OnInit {

  public loading: boolean = false;

  public form: FormGroup;

  public invitation: Invitation;

  public borderLimit: boolean = false;

  constructor(
    private _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public translateLabelService: TranslateLabelService,
    public invitationService: InvitationService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    window.analytics.page('Invitation Feebback page');

    this.initForm();
  }

  async initForm() {
    this.form = this._fb.group({
      reason: ['', [Validators.required]]
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  /**
   * submit invitation accept/reject request with reason
   */
  submitForm() {

    this.loading = true;

    let action;

    if(this.invitation.invitation_status == 2) {
      action = this.invitationService.reject(this.invitation.invitation_uuid, this.form.value.reason);
    } else {
      action = this.invitationService.accept(this.invitation.invitation_uuid, this.form.value.reason);
    }

    action.subscribe(response => {
      this.eventService.requestUpdated$.next();

      this.loading = false;

      if (response.operation == 'success') 
      {
        this.modalCtrl.dismiss({ refresh: true });
      } 
      else 
      {
        this.alertCtrl.create({
          message: this.translateLabelService.errorMessage(response.message),
          buttons: [this.translateLabelService.transform('Try Again')],
        }).then(alert => {
          alert.present();
        });
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * close popup
   */
  dismiss() {
    this.modalCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss( { refresh: false });
      }
    });
  }
}
