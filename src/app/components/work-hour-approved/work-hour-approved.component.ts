import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-work-hour-approved',
  templateUrl: './work-hour-approved.component.html',
  styleUrls: ['./work-hour-approved.component.scss'],
})
export class WorkHourApprovedComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }

}
