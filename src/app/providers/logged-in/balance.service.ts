import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private _accountEndpoint = '/balance';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * load payable data
   * @param page
   */
  payableList(page: number): Observable<any> {
    const url = `${this._accountEndpoint}/payable-list?page=${page}`;
    return this._authhttp.get(url, true);
  }
}
