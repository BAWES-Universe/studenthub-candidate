import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// Services
import { CacheService } from "ionic-cache";


/**
 * Manages Country Functionality on the server
 */
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  public ttl = 60 * 60 * 24 * 7; // TTL in seconds for one week

  constructor(
    public _http: HttpClient,
    public cache: CacheService
  ) { }

  /**
   * Filter cities 
   * @returns {Observable<any>}
   */
  filter(keyword: string, page: number): Observable<any> {
    const url = environment.apiEndpoint + '/countries/filter?page=' + page;

    let params = {
      'keyword': keyword
    };

    let request = this._http.post(url, params);//, {observe: 'response'}

    return this.cache.loadFromObservable('filter-country', request, 'country', this.ttl);
  }
}