import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, first, take, map, retryWhen } from 'rxjs/operators';
import { Observable, empty, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { genericRetryStrategy } from '../util/genericRetryStrategy';
import { RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
//import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// services
import { EventService } from './event.service';
import { TranslateLabelService } from './translate-label.service';
import { SentryErrorhandlerService } from './sentry.errorhandler.service';
// models
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
import { Candidate } from 'src/app/models/candidate';
import { Preferences as Storage } from '@capacitor/preferences';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';


declare var navigator;
declare var window;
declare var AppleID;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogin = false;

  public invitationCount = 0;

  public showOneSignalPrompt = true;

  public appleAuthLoading: boolean = false;

  // Logged in agent details
  private _accessToken;
  public id: number;
  public name: string;
  public email: string;
  public isProfileCompleted: any;
  public language_pref: string;

  public utm_uuid;

  public language = {
    code: 'en',
    name: 'English'
  };

  public store: Store;

  public company: Company;
  public candidate: Candidate;

  public candidate_job_search_status;

  public loadingJobSearchStatus: boolean = false;

  public currentLocation;

  public _urlLoginAuth0 = '/auth/login-auth0';
  public _urlBasicAuth = '/auth/login';
  public _urlEmailCheck = '/auth/email-check';
  public _urlLocate = '/auth/locate';
  public _urlRegistration = '/auth/register';
  public _urlresendVerificationEmail = '/auth/resend-verification-email';
  public urlLoginByApple = '/auth/login-by-apple';
  public _urlUpdateCandidateEmail = '/auth/update-email';
  public _urlIsEmailVerified = '/auth/is-email-verified';
  public _urlVerifyEmail = '/auth/verify-email';
  public _urlUpdatePassword = '/auth/update-password';
  public resetPassRequest = '/auth/request-reset-password';
  public _urlResetPassSMS = '/auth/sms-reset-password';
  public _urlLoginByGoogle = '/auth/login-by-google';
  public _urlLoginByKey = '/auth/login-by-key';
   
  constructor(
    public http: HttpClient,
    public router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public translate: TranslateLabelService,
    public sentryService: SentryErrorhandlerService,
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
    return new Promise(async resolve => {

      Storage.get({ key: 'loggedInUser' }).then(ret => {

        const user = JSON.parse(ret.value);

        if (user) {
          // this.setAccessToken(user);
          resolve(true);
        } else {
          resolve(false);
          this.navCtrl.navigateRoot(['landing']);
        }

      }).catch(r => {
        this.eventService.errorStorage$.next(r);
      });
    });
  }

  /**
   * return user location detail by user ip address
   * @return Observable
   */
  locate(): Observable<any> {
    const url = environment.apiEndpoint + this._urlLocate;
    const headers = this._buildAuthHeaders();
    return this.http.get(url, { headers: headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res) => res)
      );
  }
  
  /**
   * Set initial config
   */
  async load() {

    Storage.get({ key: 'loggedInUser' }).then(async ret => {

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
        this.candidate = loggedInUser.candidate;
        this.email = loggedInUser.email;
        this.isProfileCompleted = loggedInUser.isProfileCompleted;
        this.language_pref = loggedInUser.language_pref;

        if (!this.isProfileCompleted) {
          //    this.navCtrl.navigateRoot(['complete-profile']);
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

      Storage.get({ key: 'utm_uuid' }).then(res => {
         
        if(res.value) {
          this.utm_uuid = res.value;
        } else {
        //  this.utm_uuid = window.localStorage.getItem("utm_id");
        }
      });

    }).catch(r => {
      this.eventService.errorStorage$.next(r);
    });

    //saved location 
    
    const { value } = await Storage.get({ key: 'currentLocation' });

    if (value) {
      this.currentLocation = value;
    }
  }

  async loginByKey(auth_key: string) {
    
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: this.translate.transform('Logging in...')
    });
    loading.present();

    const url = environment.apiEndpoint + this._urlLoginByKey;

    const headers = this._buildAuthHeaders();

    return this.http.post(url, {
      auth_key: auth_key
    }, {
      headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        if (response.operation == 'success') {

          this.setAccessToken(response);

        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.translate.transform('Error getting login'), // JSON.stringify(err)
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();

        }

        //this.eventService.googleLoginFinished$.next({});

      }, err => {

        //this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  /**
   * Login by Auth0 accessToken
   */
  async useTokenForAuth(accessToken, showLoader = true) {

    let loading;

    if (showLoader) {
      loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: this.translate.transform('Logging in...')
      });
      loading.present();
    }

    const url = environment.apiEndpoint + this._urlLoginAuth0;

    const headers = this._buildAuthHeaders();

    return this.http.post(url, {
      accessToken,
      utm_uuid: this.utm_uuid
    }, {
      headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        if (response.operation == 'success') {

          this.setAccessToken(response);

        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.translate.transform('Error getting login'), // JSON.stringify(err)
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();

        }

        //this.eventService.googleLoginFinished$.next({});

      }, err => {

        //this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  /**
   * Set language pref for current user
   */
  setLanguagePref(language_pref) {

    Storage.set({ 'key': 'language_pref', value: language_pref }).catch(r => {
      this.eventService.errorStorage$.next(r);
    });

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
        candidate: this.candidate,
        token: this._accessToken,
        isProfileCompleted: this.isProfileCompleted,
        language_pref: this.language_pref
      })
    }).catch(r => {
      this.eventService.errorStorage$.next(r);
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
    this.candidate = null;
    this.isProfileCompleted = null;

    this.isLogin = false;

    Storage.clear().catch(r => {
      this.eventService.errorStorage$.next(r);
    });

    if(this.utm_uuid) {
      Storage.set({ key: 'utm_uuid', value: this.utm_uuid });
    }

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
    }).catch(r => {
      this.eventService.errorStorage$.next(r);
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
   * Get user arabic name from civil id
   * @param civilId e.g., 289100500862
   */
  getNameByCivilId(civilId) {

    const url = 'https://eapp.moci.gov.kw/eapp/WebPages/signup.aspx';
    //const url = 'http://localhost/studenthub/candidate/web/v1/auth/name-by-civil-id';

    const headers = new HttpHeaders({
      'authority': 'eapp.moci.gov.kw',
      'cache-control': 'no-cache',
      'x-requested-with': 'XMLHttpRequest',
      'x-microsoftajax': 'Delta=true',
      //'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      accept: '*/*',
      'Content-Type': 'text/html',
      'origin': 'https://eapp.moci.gov.kw',
      //'sec-fetch-site':'same-origin',
      //'sec-fetch-mode':'cors',
      //'sec-fetch-dest': 'empty',
      'referer': 'https://eapp.moci.gov.kw/eapp/WebPages/signup.aspx',
      //'accept-language':'en-US,en;q=0.9,ar;q=0.8',
      //'cookie': 'ASP.NET_SessionId=ny0w5j0edr2fzrn2rso31ltg'
    });
    return this.http.post(url,
      'ctl00%24ScriptManager1=ctl00%24ContentPlaceHolder1%24UpdatePanel1%7Cctl00%24ContentPlaceHolder1%24txtCivilID&ctl00%24ContentPlaceHolder1%24txtCivilID=' + civilId + '&ctl00%24ContentPlaceHolder1%24txtName=%D8%AF%D9%84%D8%A7%D9%84%20%D8%B4%D9%81%D9%8A%D9%82%20%D8%A3%D9%85%D9%8A%D9%86%20%D8%A7%D9%84%D8%B9%D9%88%D8%B6%D9%89&ctl00%24ContentPlaceHolder1%24txtLicnCivilID=&ctl00%24ContentPlaceHolder1%24txtEmail=&ctl00%24ContentPlaceHolder1%24txtPhone=&ctl00%24ContentPlaceHolder1%24txtPass=&ctl00%24ContentPlaceHolder1%24txtConfPass=&__EVENTTARGET=ctl00%24ContentPlaceHolder1%24txtCivilID&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=5SQDJO72YdvfQaFUQ%2Fts5QUW1TILOsHPq21QH9%2B0%2F53iXEpP%2BdhPA9TDriUURvMbWtYWqD0a65zRcQhdaxtJ3cF%2Fl4QxUKFlNKVkdQlsI%2B6h82G8yJNO1YfBWGlnkqF8eynDLvvQ09rnGQyyKY9St8LJjqdQ1qab2RUdkWQ50lpiG3M8%2BgXzgMQ%2FL6iAgKN%2BGhFMGagmAwjW5n0xpvHg1a4rhnZyn%2FbCTF7hDLLH%2FV8nRU%2BvRBWA641dh9SDwwjM3YzS1rKpgewFR%2BE097ywxJqfiMWuGSPZT%2FdzHaLx4JU%2B%2Fh7Bz8q4F%2FOvRU%2Beq%2BU8IlsWqmncxna6%2FCccSqd%2FYACh1KvxuWJUF62TY7c5nfat4J8tZ5bj1Qoolib6AnHNYdoFx%2BdakMb0ejXRPJABUJnO3mJ3o88Mih687kGHJzQ%3D&__VIEWSTATEGENERATOR=2945D545&__EVENTVALIDATION=aHQjT5qABVnpLuxYv5ewcvYGLCQEzumzLYzmyMBJ%2BJZtlAvu7Q4L5C3Q7ekL4HdolATaN0bKximOBaMftgwUfUyA8Ylssm%2FgfU%2F%2FL81kHi%2FWx2ZM1fe6cA0GPiZonC1s7fqWBtJAC4Fxm%2F%2F8Weua2lVXL71MYy0d7vp7sdn9mnFu6I8rdaTxOWg9PJf%2BS1RI2DMTYs1%2BCiknEGVkKnAVXbrn7DmFfLCsGF6sJgpN2FVtwDWMfOz0970hA%2F8kD5xJvVJo3G3oc1ZtirDEFGyNCA%3D%3D&__ASYNCPOST=true&',
      {
        headers: headers,
        responseType: 'text'
      }).pipe(
        // retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleCivilIdError(err)),
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
  resendVerificationEmail(email: string, token: string = '') {
    const url = environment.apiEndpoint + this._urlresendVerificationEmail;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { 'email': email, 'token': token }, { headers: headers }).pipe(
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
      Authorization: 'Basic ' + btoa(unescape(encodeURIComponent(`${email}:${password}`)))
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
    form.utm_uuid = this.utm_uuid;

    const url = environment.apiEndpoint + this._urlRegistration;
    return this.http.post(url, JSON.stringify(form), this.setHeaders())
      .pipe(
        first(),
        map((res: HttpResponse<any>) => res)
      );
  }

  /**
   * reset password request to sms recovery link 
   * @param email
   */
  resetPasswordSMS(email: string) {
    const url = environment.apiEndpoint + this._urlResetPassSMS;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { email }, { headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * reset password request
   * @param email
   */
  resetPasswordRequest(email: string, token: string = '') {
    const url = environment.apiEndpoint + this.resetPassRequest;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { 'email': email, 'token': token }, { headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  /**
   * json to string error message
   * @param message
   */
  errorMessage(message): string {

    if (this.isString(message)) {
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

  _handleCivilIdError(error: any): Observable<any> {

    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // log to slack/sentry to know how many user getting file upload error

    //this.sentryService.handleError('Error on trying to find name for Civil Id ' + errMsg);

    return empty();
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
      this.eventService.internetOffline$.next({});
      // this._auth.logout("Unable to connect to Pogi servers. Please check your internet connection.");
      return empty();
    }

    if (!navigator.onLine || error.status === 504) {
      this.eventService.internetOffline$.next({});
      return empty();
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this.logout(this.translate.transform('Session expired, please log back in.'));
      return empty();
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      this.eventService.error500$.next({});
      return empty();
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      this.eventService.error404$.next({});
      return empty();
    }

    console.error(JSON.stringify(error));

    return throwError(errMsg);
  }

  /**
   * login with AppleJS for PWA
   */
  async loginByAppleJs() {
    
    this.appleAuthLoading = true;

    try {

      const data = await AppleID.auth.signIn();

      let params;

      if (data.user && data.user.familyName) {

        Storage.set({
          key: 'appleUserDetail',
          value: JSON.stringify({
            email: data.user.email,
            familyName: data.user.name.familyName,
            givenName: data.user.name.givenName
          })
        }).catch(r => {
          this.eventService.errorStorage$.next(r);
        });

        params = {
          identityToken: data.authorization.id_token,
          email: data.user.email,
          familyName: data.user.name.familyName,
          givenName: data.user.name.givenName
        };
      }
      else
      {
        let oldData = await Storage.get({ key: 'appleUserDetail'});

        params = Object.assign((oldData) ? oldData : {}, {
          identityToken: data.authorization.id_token
        });
      }

      this.handleAppleLoginResponse(params);

    } catch (error) {
      console.error(error);
      // popup_closed_by_user
      this.appleAuthLoading = false;
    }
  }

  /**
   * login by Apple sign in
   */
  async loginByApple() {

    this.appleAuthLoading = true;
     
    let options: SignInWithAppleOptions = {
      clientId: 'co.studenthub.candidate',
      redirectURI: window.location,
      scopes: 'email name',
      state: '12345',
      nonce: 'nonce',
    };
    SignInWithApple.authorize(options)
      .then((result: SignInWithAppleResponse) => {
        this.appleAuthLoading = false;
        this.handleAppleLoginResponse(result);
      })
      .catch(error => {
        this.appleAuthLoading = false;
        this.handleAppleLoginResponse(error);
      });
  }

  /**
   * Login by Google for mobile app
   */
  loginByGoogle() {

    GoogleAuth.signIn().then(async googleUser => {

      if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
        this.useGoogleIdTokenForAuth(googleUser.authentication.idToken, false);
      } else {
        this.eventService.googleLoginFinished$.next({});

        this.showLoginError('Error getting login by Google+ API');
      }
    }).catch(async err => {

      this.eventService.googleLoginFinished$.next({});

      if (err = 'popup_closed_by_user') {
        return false;
      }

      this.showLoginError('Error getting login by Google+ API');

    });
  }
  
  /**
   * Login by google idToken
   */
  async useGoogleIdTokenForAuth(idToken, showLoader = true) {

    let loading;

    if (showLoader) {
      loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: this.translate.transform('Logging in...')
      });
      loading.present();
    }

    const url = environment.apiEndpoint + this._urlLoginByGoogle;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });
    
    return this.http.post(url, {
      idToken: idToken,
      utm_uuid: this.utm_uuid
    }, {
      headers: headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        if (response.operation == 'success') {

          this.handleLogin(response, 'google');

        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.translate.transform('Error getting login by Google+ API'), // JSON.stringify(err)
            buttons: [this.translate.transform('Ok')]
          });
          await alert.present();

        }

        this.eventService.googleLoginFinished$.next({});

      }, err => {

        this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  /**
   * handle response from apple login popup
   * @param data
   */
  async handleAppleLoginResponse(data) {
    
    if (!data || !data.response || !data.response.identityToken) {
      this.appleAuthLoading = false;

      if(data.message && data.message.indexOf("AuthorizationError") == -1) {
        this.showLoginError(this.translate.transform(data.message));
      }

      return null;
    } 

    let params;

    // save user data in first request
  
    if (data.response.givenName) {

      Storage.set({
        key: 'appleUserDetail',
        value: JSON.stringify({
          email : data.response.email,
          familyName : data.response.familyName,
          user : data.response.user,
          givenName : data.response.givenName
        })
      }).catch(r => {
        this.eventService.errorStorage$.next(r);
      });

      params = data.response;
    }
    else {
      let oldData = await Storage.get({ key : 'appleUserDetail'});

      params = Object.assign((oldData) ? oldData : {}, data.response);
    }

    this.useAppleIdTokenForAuth(params);
  }

  /**
   * login/sign up by apple auth code
   * @param params
   */
  useAppleIdTokenForAuth(params) {

    params.utm_uuid = this.utm_uuid;

    const url = environment.apiEndpoint + this.urlLoginByApple;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });

    this.http.post(url, params, {
      headers
    })
        .pipe(
            retryWhen(genericRetryStrategy()),
            catchError(err => this._handleError(err)),
            first(),
            map((res: HttpResponse<any>) => res)
        )
        .subscribe(response => {
          this.handleLogin(response, 'apple');

          this.appleAuthLoading = false;

        }, () => {
          this.appleAuthLoading = false;
        });
  }

  /**
   * Handle response from api call to get login/register by google token or otp
   * @param response
   */
  handleLogin(response, channel) {

    if (response.operation === 'success') {

      this.setAccessToken(response);

    } else {

      this.alertCtrl.create({
        message: response.message,
        buttons: [this.translate.transform('Okay')]
      }).then(alert => {
        alert.present();
      });
    }
  }

  /**
   * show login error message
   * @param message
   */
  async showLoginError(message = null) {
    const alert = await this.alertCtrl.create({
      message: message? message: this.translate.transform('Error getting login'),
      buttons: [this.translate.transform('Okay')]
    });
    await alert.present();
  }

}
