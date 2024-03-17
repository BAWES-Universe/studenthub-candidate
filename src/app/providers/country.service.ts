import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
// Services
//import { CacheService } from "ionic-cache";
import { AuthHttpService } from './logged-in/authhttp.service';


/**
 * Manages Country Functionality on the server
 */
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  //public ttl = 60 * 60 * 24 * 7; // TTL in seconds for one week

  constructor(
    public _http: AuthHttpService,
   // public cache: CacheService
  ) { }

  /**
   * Filter cities 
   * @returns {Observable<any>}
   */
  filter(keyword: string): Observable<any> {
    const url = '/countries?q= ' + keyword;
    return this._http.get(url, true);
  }
}
