import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
//models
import { Invitation } from 'src/app/models/invitation';

//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  @Input() model: Invitation;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public translateService: TranslateLabelService
  ) {
  }

  ngOnInit() {
  }
  /**
   * invitation detail page
   * @param model
   */
  invitationDetail(model: Invitation) {
    this.navCtrl.navigateForward('invitation-detail/' + model.invitation_uuid,{
      state : {
        invitation: model
      }
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
   toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

}
