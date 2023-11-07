import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { 
    mixpanel.init(environment.mixpanelKey);
  }

  /**
   * register user
   * @param id 
   * @param params 
   */
  user(id, params) {
    
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
  page(name) {
    if(window.analytics)
      window.analytics.page(name);

    /*mixpanel.track("Page View", {
      "name": name
    });*/

    mixpanel.track_pageview({"page": name});

    // track the elapsed time between a page viewed and page exit
    //call time_event with page_viewed event
    mixpanel.time_event("page_exit");
  }

  /**
   * custom event
   * @param eventName 
   * @param params 
   */
  track(eventName, params) {
    if(window.analytics)
      window.analytics.track(eventName, params);

    mixpanel.track(eventName, params);
  }
}
