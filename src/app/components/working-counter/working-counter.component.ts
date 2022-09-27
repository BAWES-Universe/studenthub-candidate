import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../providers/auth.service';
import {EventService} from "../../providers/event.service";
import {Plugins} from "@capacitor/core";

/**
 * Display alert message to update app on new version availability
 */

const { Geolocation } = Plugins;
@Component({
  selector: 'app-working-counter',
  templateUrl: './working-counter.component.html',
  styleUrls: ['./working-counter.component.scss'],
})
export class WorkingCounterComponent implements OnInit {

  public started = null;
  constructor(
      public authService: AuthService,
      public eventService: EventService,
      ) {
    if (this.authService.candidate && authService.candidate.isWorking) {
      this.started = authService.candidate.isWorking.updated_at;
    }
    this.eventService.workStarted$.subscribe(data => {
      this.started = data;
    });
    this.eventService.workStopped$.subscribe(data => {
      this.started = null;
    });
  }

  ngOnInit() {}

  stopWork() {
    this.eventService.stopWork$.next();
  }

  startWork() {

    this.eventService.startWork$.next();
  }
}
