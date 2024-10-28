import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
//import { CandidateNotifications } from 'src/app/models/candidate-education';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CandidateNotificationService {

  private _endpoint = '/candidate-notifications';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List 
   * @returns {Observable<any>}
   */
  list(page: number, urlParams: string = ''): Observable<any> {
    const url = this._endpoint + '?page=' + page + urlParams;
    return this._authhttp.get(url, true);
  }

  markRead(id: string): Observable<any> {
    const url = this._endpoint + '/mark-read/' + id;
    return this._authhttp.patch(url, {});
  }

  markReadAll(): Observable<any> {
    const url = this._endpoint + '/mark-read-all';
    return this._authhttp.patch(url, {});
  }
}

