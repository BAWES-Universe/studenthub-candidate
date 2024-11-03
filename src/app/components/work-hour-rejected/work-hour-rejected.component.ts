import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-work-hour-rejected',
  templateUrl: './work-hour-rejected.component.html',
  styleUrls: ['./work-hour-rejected.component.scss'],
})
export class WorkHourRejectedComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService : TranslateLabelService
  ) { }

  ngOnInit() {}

}
