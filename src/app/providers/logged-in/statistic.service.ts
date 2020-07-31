import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private endpoint = '/statistics';

  constructor(private authhttp: AuthHttpService) { }

  /**
   * Return statistics
   * @returns {Observable<any>}
   */
  get(): Observable<any>{
    return this.authhttp.get(this.endpoint);
  }
}
