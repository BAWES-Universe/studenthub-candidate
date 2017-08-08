import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class CandidateService {
  
  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * return work history
   * @param candidate 
   */
  workHistory(): Observable<any> {
    let url = this._candidateEndpoint +'/work-history';
    return this._authhttp.get(url);
  }
}
