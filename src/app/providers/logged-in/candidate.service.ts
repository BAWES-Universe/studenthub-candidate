import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private _candidateEndpoint = '/candidates';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * return work history
   * @param candidate
   */
  workHistory(): Observable<any> {
    const url = this._candidateEndpoint + '/work-history?expand=store';
    return this._authhttp.get(url);
  }
}
