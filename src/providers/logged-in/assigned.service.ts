import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class AssignedService {
  //private _candidateEndpoint: string = "/candidates";
  constructor(private _authhttp: AuthHttpService) { }
  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = `/account/employer`;
    return this._authhttp.get(url);
  }

}
