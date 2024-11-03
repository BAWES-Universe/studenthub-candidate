import { Component, Input, OnInit } from '@angular/core';
import { TranslateLabelService } from '../../providers/translate-label.service';

@Component({
  selector: 'app-work-log-day',
  templateUrl: './work-log-day.component.html',
  styleUrls: ['./work-log-day.component.scss'],
})
export class WorkLogDayComponent implements OnInit {

  @Input() public candidateWorkingDate;
  
  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
