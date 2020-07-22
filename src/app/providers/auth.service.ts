import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { catchError, first, take, map, retryWhen } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
// services
import { EventService } from './event.service';
import { TranslateLabelService } from './translate-label.service';


declare var navigator;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogin = false;

  // Logged in agent details
  private _accessToken;
  public id: number;
  public name: string;
  public email: string;
  public language_pref: string;

  public language = {
    code: 'en',
    name: 'English'
  };

  public _urlBasicAuth = '/auth/login';
  public _urlEmailCheck = '/auth/email-check';
  public _urlRegistration = '/auth/register';

  constructor(
    public _http: HttpClient,
    private _storage: Storage,
    public router: Router,
    public translate: TranslateLabelService,
    private _eventService: EventService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isLogin) {
      return true;
    }

    /**
     * new router changes don't wait for startup service
     * https://github.com/angular/angular/issues/14615
     */
    return new Promise(resolve => {

      return this._storage.get('loggedInUser').then(data => { 
        if (data) {
          this.setAccessToken(data);
          resolve(true);
        } else {
          resolve(false);
          this.router.navigate(['landing']);
        }
      });
    });
  }

  /**
   * Set initial config
   */
  async load() {

    const promises = [
      this._storage.get('loggedInUser'),
      this._storage.get('language')
    ];

    return Promise.all(promises)
      .then(data => {

        if (data[1]) {
          this.language = data[1];
        } else {
          
          const browserLanguage = navigator.languages
            ? navigator.languages[0]
            : (navigator.language || navigator.userLanguage);

          if (browserLanguage && browserLanguage.indexOf('en') > -1) {
            this.language = {
              code: 'en',
              name: 'English'
            };
          } else {
            this.language = {
              name: 'عربى',
              code: 'ar'
            };
          }
        }

        // for guest use language value in storage, for login user loggedInAgent.language_pref

        const loggedInUser = data[0];

        if (loggedInUser && loggedInUser.language_pref) {
          this.language = loggedInUser.language_pref == 'ar' ? {
              name: 'عربى',
              code: 'ar'
            }: {
              code: 'en',
              name: 'English'
            };
        }

        this.translate.setDefaultLang('en');
        
        this.translate.use(this.language.code);

        document.getElementsByTagName('html')[0].setAttribute('dir', (this.language.code == 'ar') ? 'rtl' : 'ltr');
        
        if (loggedInUser) {
          this.setAccessToken(loggedInUser);
        }

        /*else if (this.cookieService.get('otp')) {
          this._platform.ready().then(_ => {
            setTimeout(() => {
              this.loginByOtp(this.cookieService.get('otp'));
            }, 800);//to fix: https://www.pivotaltracker.com/story/show/168368025
          });
        }*/
 
        // set direction based on language
        // this._platform.setDir('rtl', true);
        document.documentElement.dir = (this.language.code == 'ar') ? 'rtl' : 'ltr';

      })
      .then(data => {
        // return this.logout('promise fail');
      });
  }

  /**
   * Set language pref for current user
   */
  setLanguagePref(language) {

    this._storage.set('language', language);

    this.language = language;
    this.language_pref = language.code;

    if (this._accessToken) {

      this._storage.set('loggedInUser', {
        userId: this.id,
        name: this.name,
        email: this.email,
        token: this._accessToken,
        language_pref: this.language_pref
      });
    }
  }

  /**
   * Logs a user out by setting logged in to false and clearing token from storage
   * @param {string} [reason]
   */
  logout(reason?: string) {
    // Remove from Storage then process logout
    this._accessToken = null;
    this.id = null;
    this.name = null;
    this.email = null;

    this.isLogin = false;

    this._storage.clear();

    this._eventService.userLogout$.next(reason ? reason : false);
  }

  /**
   * Set the access token
   */
  setAccessToken(data) {
    this.isLogin = true;

    this._accessToken = data.token;
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.language_pref = data.language_pref;
    
    // Save to Storage
    this._storage.set('loggedInUser', {
      userId: this.id,
      name: this.name,
      email: this.email,
      token: this._accessToken,
      language_pref: this.language_pref
    });

    if (data.language_pref) {
      this._eventService.setLanguagePref$.next(data.language_pref);
    }

    // Log User In by Triggering Event that Access Token has been Set
    this._eventService.userLogin$.next();
  }

  /**
   * Get Access Token from Service or LocalStorage
   * @returns {string} token
   */
  getAccessToken() {
    // Return Access Token if set already
    if (this._accessToken) {
      return this._accessToken;
    }

    // Check Storage and Try Again

    this._storage.get('loggedInUser').then(data => {
      
      if(data && data.token) {
        this.setAccessToken(data);
      } else {
        this.logout();
      }
    });
 
    return this._accessToken;;
  }

  /**
   * Basic auth, exchanges access details for a bearer access token to use in
   * subsequent requests.
   * @param  {string} email
   * @param  {string} password
   */
  basicAuth(email: string, password: string): Observable<any> {
    // Add Basic Auth Header with Base64 encoded email and password

    const authHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${email}:${password}`)
    });

    const url = environment.apiEndpoint + this._urlBasicAuth;

    return this._http.get(url, {
      headers: authHeader
    })
      .pipe(
        take(1),
        // map((res: Response) => res)
      );
  }

  /**
   * mobile check
   * @param form
   */
  mobileCheck(form): Observable<any> {
    const url = environment.apiEndpoint + this._urlEmailCheck;
    return this._http.post(url, JSON.stringify(form), this.setHeaders())
        .pipe(
            first(),
            map((res: HttpResponse<any>) => res)
        );
  }

  setHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Language: this.language_pref || 'en'
      })
    };
  }

  /**
   * create new account
   * @param form
   */
  createAccount(form): Observable<any> {
    const url = environment.apiEndpoint + this._urlRegistration;
    return this._http.post(url, JSON.stringify(form), this.setHeaders())
        .pipe(
            first(),
            map((res: HttpResponse<any>) => res)
        );
  }

  /**
   * json to string error message
   * @param message
   */
  errorMessage(message): string {

    if (message.length) {
      return message + '';
    }

    const a = [];

    for (const i in message) {

      if (!Array.isArray(message[i])) {
        a.push(message[i]);
        continue;
      }

      for (const j of message[i]) {
        a.push(j);
      }
    }

    return a.join('<br />');
  }
}
