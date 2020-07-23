import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
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
