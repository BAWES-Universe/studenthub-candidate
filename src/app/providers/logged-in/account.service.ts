import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { Candidate } from 'src/app/models/candidate';


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

  /**
   * Update email address 
   * @param candidate Candidate 
   */
  updateEmail(candidate: Candidate): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-email';
    return this._authhttp.post(url, { email: candidate.candidate_email });
  }

  /**
   * set user language preference 
   * @param code language code 
   */
  setLanguagePref(code): Observable<any> {
    let url = `${this._accountEndpoint}` + '/language-pref';
    return this._authhttp.post(url, {
        language_pref: code
    });
  }
}
