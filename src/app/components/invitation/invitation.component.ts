import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
//models
import { Invitation } from 'src/app/models/invitation';
//pages
import { InvitationFeedbackPage } from 'src/app/pages/logged-in/invitation-feedback/invitation-feedback.page';
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
    public translateService: TranslateLabelService
  ) {
    console.log(this.model);
  }

  ngOnInit() {
  }

  /**
   * open popup to accept invitation with reason
   * @param $event 
   */
  async accept($event) {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let invitation = Object.assign({}, this.model);

    invitation.invitation_status = 3;//accept

    const modal = await this.modalCtrl.create({
      component: InvitationFeedbackPage,
      componentProps: {
        invitation: invitation
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data.refresh) {
        this.onUpdate.emit();
      }
    });
  }

  /**
   * open popup to reject invitation with reason
   * @param $event 
   */
  async reject($event) {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let invitation = Object.assign({}, this.model);

    invitation.invitation_status = 2;//reject

    const modal = await this.modalCtrl.create({
      component: InvitationFeedbackPage,
      componentProps: {
        invitation: invitation
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data.refresh) {
        this.onUpdate.emit();
      }
    });
  }
}
