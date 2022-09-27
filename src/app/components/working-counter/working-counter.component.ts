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

    let d = new Date(Date.now());

    let year = d.getFullYear();
    let month = (d.getMonth()+1);
    let date = d.getDate();
    let hour = (d.getHours() > 12 ? d.getHours() - 12 : d.getHours());
    let min = d.getMinutes();
    let zone = d.getHours() >= 12 ? 'PM' : 'AM';
    console.log(`${year}-${month}-${date} ${hour}:${min} ${zone}`);
    if (this.authService.candidate && this.authService.candidate.isWorking) {
      this.started = this.authService.candidate.isWorking.updated_at;
    }

    this.eventService.workStarted$.subscribe(_ => {
      this.started = `${year}-${month}-${date} ${hour}:${min} ${zone}`;
      // this.eventService.loadProfile$.next();
    });
    this.eventService.workStopped$.subscribe((data) => {
      // this.eventService.loadProfile$.next();
      this.started = null;
    });
  }

  stopWork() {
    this.eventService.stopWork$.next();
  }

  startWork() {
    console.log('startWork');
    this.eventService.startWork$.next();
  }
}
