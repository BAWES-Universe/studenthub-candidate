import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// Services
import { CacheService } from 'ionic-cache';


/**
 * Manages University Functionality on the server
 */
@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  public ttl = 60 * 60 * 24 * 7; // TTL in seconds for one week

  constructor(
    public _http: HttpClient,
    public cache: CacheService
  ) { }

  /**
   * Filter university
   * @returns {Observable<any>}
   */
  filter(keyword: string, page: number): Observable<any> {
    const url = environment.apiEndpoint + '/universities?q=' + keyword;
    return this._http.get(url);

    //return this.cache.loadFromObservable('filter-university', request, 'university', this.ttl);
  }
}
