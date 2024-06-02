import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from 'src/environments/environment';
//services
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(public authService: AuthService) { 
    mixpanel.init(environment.mixpanelKey);
  }

  /**
   * register user
   * @param id 
   * @param params 
   */
  async user(id, params) {
    
    //segment

    if(window.analytics)
      window.analytics.identify(id, {
        name: params.name,
        email: params.email,
      });

    //mixpanel 

    mixpanel.identify(id);

    mixpanel.people.set(params);
  }

  /**
   * page event
   * @param name 
   */
  async page(name) {
    if(window.analytics)
      window.analytics.page(name);

    /*mixpanel.track("Page View", {
      "name": name
    });*/

    const params = {
      language : this.authService.language_pref,
      channel : "Candidate Web App",
    }

    mixpanel.track_pageview({"page": name, ...params });

    // track the elapsed time between a page viewed and page exit
    //call time_event with page_viewed event
    mixpanel.time_event("page_exit");
  }

  /**
   * custom event
   * @param eventName 
   * @param params 
   */
  async track(eventName, params) {
    
    params.language = this.authService.language_pref; 
    params.channel = "Candidate Web App"; 
    
    if(window.analytics)
      window.analytics.track(eventName, params);
    
    mixpanel.track(eventName, params);
  }

  async refresh() {
    mixpanel.reset();
  }
}
