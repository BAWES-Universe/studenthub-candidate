import { Component, Input, OnInit } from '@angular/core';
import { CandidateNotification } from "../../models/candidate-notification";
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-transfer-paid',
  templateUrl: './transfer-paid.component.html',
  styleUrls: ['./transfer-paid.component.scss'],
})
export class TransferPaidComponent implements OnInit {

  @Input() public candidateNotification: CandidateNotification;

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
