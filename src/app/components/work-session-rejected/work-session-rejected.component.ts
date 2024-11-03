import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';


@Component({
  selector: 'app-work-session-rejected',
  templateUrl: './work-session-rejected.component.html',
  styleUrls: ['./work-session-rejected.component.scss'],
})
export class WorkSessionRejectedComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
