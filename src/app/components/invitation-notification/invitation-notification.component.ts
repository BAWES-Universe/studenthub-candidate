import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-invitation-notification',
  templateUrl: './invitation-notification.component.html',
  styleUrls: ['./invitation-notification.component.scss'],
})
export class InvitationNotificationComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
