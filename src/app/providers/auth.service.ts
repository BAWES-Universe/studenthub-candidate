import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { catchError, first, take, map, retryWhen } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
// services
import { EventService } from './event.service';


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

  private _urlBasicAuth = '/auth/login';
  public _urlEmailCheck = '/auth/email-check';
  public _urlRegistration = '/auth/register';
  constructor(
    public _http: HttpClient,
    private _storage: Storage,
    public router: Router,
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

      const promises = [
        this._storage.get('bearer'),
        this._storage.get('id'),
        this._storage.get('name'),
        this._storage.get('email')
      ];

      return Promise.all(promises)
        .then(results => {

          if (results[0] && results[1] && results[2] && results[3]) {

            this.isLogin = true;
            this._accessToken = results[0];
            this.id = results[1];
            this.name = results[2];
            this.email = results[3];

            resolve(true);
          } else {
            resolve(false);
            this.router.navigate(['landing']);
          }
        });
    });
  }

  // This is the method you want to call at bootstrap
  load(): Promise<any> {

    const promises = [
      this._storage.get('bearer'),
      this._storage.get('id'),
      this._storage.get('name'),
      this._storage.get('email')
    ];

    return Promise.all(promises)
      .then(results => {

        if (results[0] && results[1] && results[2] && results[3]) {
          this.setAccessToken(results[0], results[1], results[2], results[3]);
          return this.getAccessToken();
        } else {
          this.logout();
        }
      })
      .then(data => {
        // return this.logout('promise fail');
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

    this.isLogin = false;

    this._storage.clear();

    this._eventService.userLogout$.next(reason ? reason : false);
  }

  /**
   * Set the access token
   */
  setAccessToken(token: string, id: number, name: string, email: string) {
    this.isLogin = true;

    this._accessToken = token;
    this.id = id;
    this.name = name;
    this.email = email;

    // Save to Storage
    this._storage.set('bearer', token);
    this._storage.set('id', id);
    this._storage.set('name', name);
    this._storage.set('email', email);

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
    const p1 = this._storage.get('bearer');
    const p2 = this._storage.get('id');
    const p3 = this._storage.get('name');
    const p4 = this._storage.get('email');

    Promise.all([p1, p2, p3, p4]).then(results => {
      if (results[0] && results[1] && results[2] && results[3]) {
        this.setAccessToken(results[0], results[1], results[2], results[3]);
        return this.getAccessToken();
      } else {
        this.logout();
      }
    }, () => {
      // On Promise Failure
      this.logout();
    });

    // No Access Token Available
    return false;
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
