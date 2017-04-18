import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Account Functionality on the server
 */
@Injectable()
export class AccountService {

  private _accountEndpoint: string = "/account";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all stores
   * @returns {Observable<any>}
   */
  listSalary(page: number): Observable<any> {
    let url = this._accountEndpoint + '/salary?page=' + page;
    return this._authhttp.getRaw(url);
  }
}

