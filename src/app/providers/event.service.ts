import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  public internetOffline$ = new Subject();
  public error404$ = new Subject();
  public error500$ = new Subject();
  public errorStorage$ = new Subject();
  
  public userLogout$ = new Subject();
  public userLogin$ = new Subject();
  public userUpdated$ = new Subject();
  public nameUpdated$ = new Subject();
  public bankUpdated$ = new Subject();
  public profileUrlUpdated$ = new Subject();

  public setOneSignalSubscription$ = new Subject();
  public setOneSignal$ = new Subject();
  
  public setLanguagePref$ = new Subject();
  public kuwaitiNationl$ = new Subject();

  public candidateVideoProcessed$ = new Subject();

  public tabScrolled$ = new Subject();
  public requestUpdated$ = new Subject();

  public startWork$ = new Subject();
  public stopWork$ = new Subject();

  public workStarted$ = new Subject();
  public workStopped$ = new Subject();

  public loadProfile$ = new Subject();

  constructor() { }
}
