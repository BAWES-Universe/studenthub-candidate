import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { CacheService } from 'ionic-cache';
import { AuthHttpService } from './logged-in/authhttp.service';


/**
 * Manages University Functionality on the server
 */
@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  //public ttl = 60 * 60 * 24 * 7; // TTL in seconds for one week

  constructor(
    public _http: AuthHttpService,
    public cache: CacheService
  ) { }

  /**
   * Filter university
   * @returns {Observable<any>}
   */
  filter(keyword: string, page: number): Observable<any> {
    const url = '/universities?q=' + keyword;
    return this._http.get(url, true);

    //return this.cache.loadFromObservable('filter-university', request, 'university', this.ttl);
  }
}
