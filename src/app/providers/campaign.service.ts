import { Injectable } from '@angular/core';
import { AuthHttpService } from './logged-in/authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private endpoint = '/campaigns';
  
  constructor(
    private http: AuthHttpService
  ) { }

  click(utm_uuid) {
    const url = `${this.endpoint}/click/${utm_uuid}`;
    return this.http.patch(url, {});
  }
}
