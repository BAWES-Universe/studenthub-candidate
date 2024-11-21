import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private _candidateEndpoint = '/candidates';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * assignment details
   * @param id 
   * @returns 
   */
  workHistoryDetail(id: string | number): Observable<any> {
    const url = this._candidateEndpoint + '/work-history/' + id + '?expand=store,company,company.parentCompany,contract,contract.amount';
    return this._authhttp.get(url);
  }

  /**
   * @param currentPage 
   * @param urlParams 
   * @returns 
   */
  listCandidateWorkingDates(page: number, urlParams: string = "") : Observable<any> {
    let url = `${this._candidateEndpoint}/working-dates?page=${page}&${urlParams}`;
    return this._authhttp.get(url, true);
  }

  /**
   * return work history
   * @param candidate
   */
  workHistory(): Observable<any> {
    const url = this._candidateEndpoint + '/work-history?expand=store,company,company.parentCompany';
    return this._authhttp.get(url);
  }

  /**
   * download candidate appreciation certificate
   * @param workHistoryID
   */
  downloadCertificate(workHistoryID): Observable<any> {
    let url = `${this._candidateEndpoint}/appreciation-certificate/${workHistoryID}`;
    return this._authhttp.pdfget(url, 'appreciation-certification-' + workHistoryID + '.pdf');
  }
}
