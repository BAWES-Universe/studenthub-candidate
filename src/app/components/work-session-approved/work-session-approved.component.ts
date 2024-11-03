import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';


@Component({
  selector: 'app-work-session-approved',
  templateUrl: './work-session-approved.component.html',
  styleUrls: ['./work-session-approved.component.scss'],
})
export class WorkSessionApprovedComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
