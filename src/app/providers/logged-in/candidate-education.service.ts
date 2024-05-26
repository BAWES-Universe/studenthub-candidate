import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { CandidateEducation } from 'src/app/models/candidate-education';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CandidateEducationService {

  private _endpoint = '/candidate-educations';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List all requests with page
   * @returns {Observable<any>}
   */
  list(page: number, urlParams: string = ''): Observable<any> {
    const url = this._endpoint + '?page=' + page + urlParams;
    return this._authhttp.get(url, true);
  }

  /**
   * return education detail
   * @param education_uuid
   */
  detail(education_uuid): Observable<any>{
    const url = this._endpoint + '/' + education_uuid + '?expand=university,major,degree';
    return this._authhttp.get(url);
  }

  /**
   * add education
   * @param model 
   * @returns 
   */
  create(model: CandidateEducation): Observable<any>{
    const url = this._endpoint;
    return this._authhttp.post(url, model);
  }

  /**
   * @param model 
   * @returns 
   */
  update(model: CandidateEducation): Observable<any>{
    const url = this._endpoint + '/' + model.education_uuid;
    return this._authhttp.patch(url, model);
  }

  /**
   * @param education_uuid 
   * @returns 
   */
  delete(education_uuid): Observable<any>{
    const url = this._endpoint + '/' + education_uuid;
    return this._authhttp.delete(url);
  }
}
