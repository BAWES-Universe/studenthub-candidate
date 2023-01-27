import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../providers/auth.service';
import {EventService} from "../../providers/event.service";
import {AccountService} from "../../providers/logged-in/account.service";

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
      public eventService: EventService,
      public accountStatus: AccountService
  ) { }

  ngOnInit() {

    if (this.authService && this.authService.isLogin && this.authService.candidate && this.authService.candidate.isWorking) {
      this.started = this.authService.candidate.isWorking.updated_at;
    }

    this.eventService.workStarted$.subscribe(_ => {
      this.accountStatus.checkWorkStatus().subscribe((data: any) => {
        if (data) {
          this.started = data.updated_at;
        }
      });
    });

    this.eventService.workStopped$.subscribe((data) => {
      this.started = null;
    });
  }

  stopWork() {
    this.eventService.stopWork$.next({});
  }

  startWork() {
    this.eventService.startWork$.next({});
  }
}
