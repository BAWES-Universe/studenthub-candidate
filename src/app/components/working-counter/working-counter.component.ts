import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../providers/auth.service';
import {EventService} from "../../providers/event.service";

/**
 * Display alert message to update app on new version availability
 */
@Component({
  selector: 'app-working-counter',
  templateUrl: './working-counter.component.html',
  styleUrls: ['./working-counter.component.scss'],
})
export class WorkingCounterComponent implements OnInit {

  constructor(
      public authService: AuthService,
      public eventService: EventService,
      ) {
  }

  ngOnInit() {
  }

  stopWork() {
    this.eventService.stopWork$.next();
  }

  startWork() {
    this.eventService.startWork$.next();
  }
}
