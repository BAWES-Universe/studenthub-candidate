import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private _endpoint = '/invitations';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    const url = this._endpoint + '?page=' + page + '&expand=request,company';
    return this._authhttp.get(url);
  }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  count(): Observable<any>{
    const url = this._endpoint + '?count=1';
    return this._authhttp.get(url);
  }

  /**
   * accept invitation for request
   * @param invitation_uuid
   * @param reason
   */
  accept(invitation_uuid: string, reason: string = ''): Observable<any> {
    const url = `${this._endpoint}/accept/${invitation_uuid}`;
    const params = {
      reason: reason
    };
    return this._authhttp.patch(url, params);
  }

  /**
   * reject invitation for request
   * @param invitation_uuid
   * @param reason
   */
  reject(invitation_uuid: string, reason: string = ''): Observable<any> {
    const url = `${this._endpoint}/reject/${invitation_uuid}`;
    const params = {
      reason: reason
    };
    return this._authhttp.patch(url, params);
  }
}
