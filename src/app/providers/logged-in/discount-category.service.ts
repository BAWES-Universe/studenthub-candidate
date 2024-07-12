import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { DiscountCategory } from '../../models/discount-category';


@Injectable({
  providedIn: 'root'
})
export class DiscountCategoryService {

  private _discountEndpoint: string = "/discount-categories";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all discount
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    let url = this._discountEndpoint + '?expand=&page=' + page;
    return this._authhttp.get(url, true);
  }
  
  /**
   * return discount detail 
   * @param category_id 
   */
  view(category_id: number): Observable<any>{
    let url = this._discountEndpoint + '/' + category_id + '?expand=';
    return this._authhttp.get(url);
  }
}
