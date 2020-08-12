import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  public internetOffline$ = new Subject();
  public error404$ = new Subject();
  public error500$ = new Subject();
  
  public userLogout$ = new Subject();
  public userLogin$ = new Subject();
  public userUpdated$ = new Subject();

  public setOneSignalSubscription$ = new Subject();
  public setOneSignal$ = new Subject();
  
  public setLanguagePref$ = new Subject();

  constructor() { }
}
