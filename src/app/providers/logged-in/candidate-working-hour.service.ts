import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateWorkingHourService {

  private _endpoint = '/candidate-working-hours';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    const url = this._endpoint + '/date?page=' + page + '&expand=company';
    return this._authhttp.get(url, true);
  }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  listByHour(page: number,param = null): Observable<any>{
    const url = this._endpoint + `/hour?page=${page}&expand=store,store.company${param}`;
    return this._authhttp.get(url, true);
  }
}
