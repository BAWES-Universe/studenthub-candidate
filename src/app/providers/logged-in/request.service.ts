import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  
  private _endpoint = '/invitations';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List all requests with page
   * @returns {Observable<any>}
   */
  list(page: number, urlParams: string = ''): Observable<any> {
    const url = this._endpoint + '?page=' + page + urlParams;
    return this._authhttp.get(url, true);
  }

  /**
   * list job applications 
   * @param page 
   * @param urlParams 
   * @returns 
   */
  listApplications(page: number, urlParams: string = ''): Observable<any> {
    const url = this._endpoint + '/applications?page=' + page + urlParams;
    return this._authhttp.get(url, true);
  }

  /**
   * apply for job/ request
   * @param request_uuid 
   * @returns 
   */
  apply(request_uuid: string): Observable<any> {
    const url = this._endpoint + '/apply/' + request_uuid;
    return this._authhttp.post(url, {});
  }
  
  /**
   * view request
   * @param request_uuid 
   * @returns 
   */
  view(request_uuid: string): Observable<any> {
    const url = this._endpoint + '/' + request_uuid;
    return this._authhttp.get(url);
  }
}
