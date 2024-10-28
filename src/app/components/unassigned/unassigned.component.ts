import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-unassigned',
  templateUrl: './unassigned.component.html',
  styleUrls: ['./unassigned.component.scss'],
})
export class UnassignedComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;
  
  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    
  }

}
