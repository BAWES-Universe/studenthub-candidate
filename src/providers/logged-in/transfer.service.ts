import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class TransferService {

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all transfers
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = `/account/salary`;
    return this._authhttp.get(url);
  }
}
