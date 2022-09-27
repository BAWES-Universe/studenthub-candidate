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

  public started = null;
  constructor(
      public authService: AuthService,
      public eventService: EventService
  ) { }

  ngOnInit() {

    let d = Date.now();
    d = new Date(d);
    d = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+(d.getHours() > 12 ? d.getHours() - 12 : d.getHours())+':'+d.getMinutes()+' '+(d.getHours() >= 12 ? "PM" : "AM");
    console.log(d);
    if (this.authService.candidate && this.authService.candidate.isWorking) {
      this.started = this.authService.candidate.isWorking.updated_at;
    }

    this.eventService.workStarted$.subscribe((data) => {
      this.started = d;
      this.eventService.loadProfile$.next();
    });
    this.eventService.workStopped$.subscribe((data) => {
      this.eventService.loadProfile$.next();
      this.started = null;
    });
  }

  stopWork() {
    this.eventService.stopWork$.next();
  }

  startWork() {
    this.eventService.startWork$.next();
  }
}
