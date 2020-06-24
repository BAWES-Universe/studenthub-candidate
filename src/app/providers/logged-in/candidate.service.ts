import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
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
