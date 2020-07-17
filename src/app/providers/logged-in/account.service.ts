import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountEndpoint = '/account';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all stores
   * @returns {Observable<any>}
   */
  listSalary(page: number): Observable<any> {
    const url = this._accountEndpoint + '/salary?page=' + page;
    return this._authhttp.get(url, true);
  }

  /**
   * Create
   * @param {oldPassword} string
   * @param {newPassword} string
   * @returns {Observable<any>}
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any>{
    const postUrl = `${this._accountEndpoint}` + '/change-password';
    const params = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    return this._authhttp.post(postUrl, params);
  }
}
