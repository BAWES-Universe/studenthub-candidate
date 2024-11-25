import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
import { CandidateWorkingHour } from '../../models/candidate';

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
  list(page: number, params = '&expand=company,dateListByCandidate'): Observable<any>{
    const url = this._endpoint + '/date?page=' + page + params;
    return this._authhttp.get(url, true);
  }

  /**
   * @param currentPage 
   * @param urlParams 
   * @returns 
   */
  listCandidateWorkingDates(page: number, urlParams: string = "") : Observable<any> {
    let url = `${this._endpoint}/working-dates?page=${page}&${urlParams}`;
    return this._authhttp.get(url, true);
  }
  
  /**
   * add session manually 
   * @param model 
   * @returns 
   */
  add(model: CandidateWorkingHour): Observable<any>{
    const url = this._endpoint;
    return this._authhttp.post(url, model);
  }

  /**
   * return date detail 
   * @param date
   */
  dateDetail(date): Observable<any>{
    const url = `${this._endpoint}/date-detail/${date}`;
    return this._authhttp.get(url);
  }

  /**
   * return day detail by hours
   * @param date
   */
  detail(date): Observable<any>{
    const url = `${this._endpoint}/date/${date}?expand=company,dateListByCandidate`;
    return this._authhttp.get(url);
  }

  /**
   * @param date 
   * @returns 
   */
  stats(date): Observable<any>{
    const url = `${this._endpoint}/stats?${date}`;
    return this._authhttp.get(url);
  }

  /**
   * Return hours/ sessions
   * @returns {Observable<any>}
   */
  listHours(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/hour?page=${page}&expand=store,store.company${param}`;
    return this._authhttp.get(url, true);
  }

  /**
   * list dates 
   * @param page 
   * @param param 
   * @returns 
   */
  listDates(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/working-dates?page=${page}&expand=store,store.company${param}`;
    return this._authhttp.get(url, true);
  }
}
