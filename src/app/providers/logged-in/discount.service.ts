import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Discount } from '../../models/discount';


@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private _discountEndpoint: string = "/discounts";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all discount
   * @returns {Observable<any>}
   */
  list(page: number, urlParams: string = ""): Observable<any>{
    let url = this._discountEndpoint + '?expand=company,store,category&page=' + page + urlParams;
    return this._authhttp.get(url, true);
  }
  
  /**
   * return discount detail 
   * @param discount_uuid 
   */
  view(discount_uuid: string): Observable<any>{
    let url = this._discountEndpoint + '/' + discount_uuid + '?expand=company,store,category';
    return this._authhttp.get(url);
  }
}
