import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-transfer-unpaid',
  templateUrl: './transfer-unpaid.component.html',
  styleUrls: ['./transfer-unpaid.component.scss'],
})
export class TransferUnpaidComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
