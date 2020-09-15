import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { catchError, first, take, map, retryWhen } from 'rxjs/operators';
import { Observable, empty, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { genericRetryStrategy } from '../util/genericRetryStrategy';
import { RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
// services
import { EventService } from './event.service';
import { TranslateLabelService } from './translate-label.service';


declare var navigator;

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogin = false;

  public showOneSignalPrompt = true;
  
  // Logged in agent details
  private _accessToken;
  public id: number;
  public name: string;
  public email: string;
  public isProfileCompleted: any;
  public language_pref: string;

  public language = {
    code: 'en',
    name: 'English'
  };

  public _urlBasicAuth = '/auth/login';
  public _urlEmailCheck = '/auth/email-check';
  public _urlRegistration = '/auth/register';
  public _urlresendVerificationEmail = '/auth/resend-verification-email';
  public _urlUpdateCandidateEmail = '/auth/update-email';
  public _urlIsEmailVerified = '/auth/is-email-verified';
  public _urlVerifyEmail = '/auth/verify-email';
  public _urlUpdatePassword = '/auth/update-password';
  public resetPassRequest = '/auth/request-reset-password';

  constructor(
    public http: HttpClient,
    public router: Router,
    public navCtrl: NavController,
    public translate: TranslateLabelService,
    private eventService: EventService
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
    return new Promise(async resolve =>  {

      const ret = await Storage.get({ key: 'loggedInUser' });
      const user = JSON.parse(ret.value);

      if (user) {
        // this.setAccessToken(user);
        resolve(true);
      } else {
        resolve(false);
        this.navCtrl.navigateRoot(['landing']);
      }
    });
  }

  /**
   * Set initial config
   */
  async load() {

    const ret = await Storage.get({ key: 'loggedInUser' });
    
    const loggedInUser = JSON.parse(ret.value);

    // guest user who visited previously and saved preference

    const { value } = await Storage.get({ key: 'language_pref' });

    if (value) {
      this.language_pref = value;

      this.language = this.language_pref == 'ar' ? {
        name: 'عربى',
        code: 'ar'
      } : {
        code: 'en',
        name: 'English'
      };

    // new user

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

    if (loggedInUser && loggedInUser.language_pref) {
      this.language = loggedInUser.language_pref == 'ar' ? {
          name: 'عربى',
          code: 'ar'
        } : {
          code: 'en',
          name: 'English'
        };
    }

    this.translate.setDefaultLang('en');
    
    this.translate.use(this.language.code);

    document.getElementsByTagName('html')[0].setAttribute('dir', (this.language.code == 'ar') ? 'rtl' : 'ltr');
    
    if (loggedInUser) {

      this.isLogin = true;

      this._accessToken = loggedInUser.token;
      this.id = loggedInUser.id;
      this.name = loggedInUser.name;
      this.email = loggedInUser.email;
      this.isProfileCompleted = loggedInUser.isProfileCompleted;
      this.language_pref = loggedInUser.language_pref;

      if(!this.isProfileCompleted) {
        this.navCtrl.navigateRoot(['complete-profile']);
      }
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
  }

  /**
   * Set language pref for current user
   */
  setLanguagePref(language_pref) {

    Storage.set({ 'key':'language_pref', value: language_pref });

    this.language_pref = language_pref;

    this.language = this.language_pref == 'ar' ? {
      name: 'عربى',
      code: 'ar'
    } : {
      code: 'en',
      name: 'English'
    };

    if (this._accessToken) {
      this.saveLoggedInUser();
    }
  }

  /**
   * save user details for future reference in storage
   */
  saveLoggedInUser() {
    Storage.set({
      key: 'loggedInUser',
      value: JSON.stringify({
        id: this.id,
        name: this.name,
        email: this.email,
        token: this._accessToken,
        isProfileCompleted: this.isProfileCompleted,
        language_pref: this.language_pref
      })
    });
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
    this.isProfileCompleted = null;

    this.isLogin = false;

    Storage.clear();

    this.eventService.userLogout$.next(reason ? reason : false);
  }

  /**
   * Set the access token
   */
  async setAccessToken(data) {

    this.isLogin = true;

    this._accessToken = data.token;
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.isProfileCompleted = data.isProfileCompleted;

    /*
    //to fix: https://www.pivotaltracker.com/story/show/174788568

    this.language_pref = data.language_pref;      

    if(data.language_pref) {      
      this.eventService.setLanguagePref$.next(data.language_pref);
    }*/

    // Save to Storage
    this.saveLoggedInUser();

    // Log User In by Triggering Event that Access Token has been Set
    this.eventService.userLogin$.next(data);
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

    Storage.get({ key: 'loggedInUser' }).then(ret => {
      const user = JSON.parse(ret.value);

      if (user) {
        this.setAccessToken(user);
      }
    });
 
    return this._accessToken;
  }
  
  /**
   * Build the Auth Headers for All Verb Requests
   * @returns {HttpHeaders}
   */
  public _buildAuthHeaders() {
    // Get Bearer Token from Auth Service

    // Build Headers with Bearer Token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });
  }

  /**
   * Update password by token got in email 
   * @param password
   * @param token
   */
  updatePassword(password: string, token: string) {
    const url = environment.apiEndpoint + this._urlUpdatePassword;
    const headers = this._buildAuthHeaders();
    return this.http.patch(url, { newPassword: password, 'token': token }, { headers: headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  
  /**
   * test
   */
  test() {
    const url = 'https://eapp.moci.gov.kw/eapp/WebPages/signup.aspx';
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });
    return this.http.post(url, 'ctl00%24ScriptManager1=ctl00%24ContentPlaceHolder1%24UpdatePanel1%7Cctl00%24ContentPlaceHolder1%24txtCivilID&ctl00%24ContentPlaceHolder1%24txtCivilID=289100500862&ctl00%24ContentPlaceHolder1%24txtName=%D8%AF%D9%84%D8%A7%D9%84%20%D8%B4%D9%81%D9%8A%D9%82%20%D8%A3%D9%85%D9%8A%D9%86%20%D8%A7%D9%84%D8%B9%D9%88%D8%B6%D9%89&ctl00%24ContentPlaceHolder1%24txtLicnCivilID=&ctl00%24ContentPlaceHolder1%24txtEmail=&ctl00%24ContentPlaceHolder1%24txtPhone=&ctl00%24ContentPlaceHolder1%24txtPass=&ctl00%24ContentPlaceHolder1%24txtConfPass=&__EVENTTARGET=ctl00%24ContentPlaceHolder1%24txtCivilID&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=5SQDJO72YdvfQaFUQ%2Fts5QUW1TILOsHPq21QH9%2B0%2F53iXEpP%2BdhPA9TDriUURvMbWtYWqD0a65zRcQhdaxtJ3cF%2Fl4QxUKFlNKVkdQlsI%2B6h82G8yJNO1YfBWGlnkqF8eynDLvvQ09rnGQyyKY9St8LJjqdQ1qab2RUdkWQ50lpiG3M8%2BgXzgMQ%2FL6iAgKN%2BGhFMGagmAwjW5n0xpvHg1a4rhnZyn%2FbCTF7hDLLH%2FV8nRU%2BvRBWA641dh9SDwwjM3YzS1rKpgewFR%2BE097ywxJqfiMWuGSPZT%2FdzHaLx4JU%2B%2Fh7Bz8q4F%2FOvRU%2Beq%2BU8IlsWqmncxna6%2FCccSqd%2FYACh1KvxuWJUF62TY7c5nfat4J8tZ5bj1Qoolib6AnHNYdoFx%2BdakMb0ejXRPJABUJnO3mJ3o88Mih687kGHJzQ%3D&__VIEWSTATEGENERATOR=2945D545&__EVENTVALIDATION=aHQjT5qABVnpLuxYv5ewcvYGLCQEzumzLYzmyMBJ%2BJZtlAvu7Q4L5C3Q7ekL4HdolATaN0bKximOBaMftgwUfUyA8Ylssm%2FgfU%2F%2FL81kHi%2FWx2ZM1fe6cA0GPiZonC1s7fqWBtJAC4Fxm%2F%2F8Weua2lVXL71MYy0d7vp7sdn9mnFu6I8rdaTxOWg9PJf%2BS1RI2DMTYs1%2BCiknEGVkKnAVXbrn7DmFfLCsGF6sJgpN2FVtwDWMfOz0970hA%2F8kD5xJvVJo3G3oc1ZtirDEFGyNCA%3D%3D&__ASYNCPOST=true&', 
      { headers: headers }).pipe(
     // retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Verify email
   * @param email
   * @param code
   */
  verifyEmail(email: string, code: string) {
    const url = environment.apiEndpoint + this._urlVerifyEmail;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { email: email, 'code': code }, { headers: headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Check if email already verified
   * @param res
   */
  isAlreadyVerified(res): Observable<any> {
    const url = environment.apiEndpoint + this._urlIsEmailVerified;
    return this.http.post(url, res, { headers: this._buildAuthHeaders() }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Resend verification email
   * @param email
   */
  resendVerificationEmail(email: string) {
    const url = environment.apiEndpoint + this._urlresendVerificationEmail;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { 'email': email }, { headers: headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }
  
  /**
   * Update email address
   * @param params params
   */
  updateEmail(params: any): Observable<any> {
    const url = environment.apiEndpoint + this._urlUpdateCandidateEmail;
    return this.http.post(url, params, { headers: this._buildAuthHeaders() }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
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

    return this.http.get(url, {
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
    return this.http.post(url, JSON.stringify(form), this.setHeaders())
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
    return this.http.post(url, JSON.stringify(form), this.setHeaders())
        .pipe(
            first(),
            map((res: HttpResponse<any>) => res)
        );
  }

  /**
   * reset password request
   * @param email
   */
  resetPasswordRequest(email: string) {
    const url = environment.apiEndpoint + this.resetPassRequest;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { email }, { headers }).pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
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

  /**
   * Handles Caught Errors from All Authorized Requests Made to Server
   * @returns {Observable}
   */
  public _handleError(error: any): Observable<any> {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // Handle Bad Requests
    // This error usually appears when agent attempts to handle an
    // account that he's been removed from assigning
    if (error.status === 400) {
      this.logout(this.translate.transform('Bad request, please log back in.'));
      return empty();
    }

    // Handle No Internet Connection Error

    if (error.status == 0 || error.status == 504) {
      this.eventService.internetOffline$.next();
      // this._auth.logout("Unable to connect to Pogi servers. Please check your internet connection.");
      return empty();
    }

    if (!navigator.onLine || error.status === 504) {
      this.eventService.internetOffline$.next();
      return empty();
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this.logout(this.translate.transform('Session expired, please log back in.'));
      return empty();
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      this.eventService.error500$.next();
      return empty();
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      this.eventService.error404$.next();
      return empty();
    }

    console.error(JSON.stringify(error));

    return throwError(errMsg);
  }
}
