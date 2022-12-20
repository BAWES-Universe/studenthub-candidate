import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, empty, throwError } from 'rxjs';
import { catchError, take, map, retryWhen } from 'rxjs/operators';
import { genericRetryStrategy } from '../../util/genericRetryStrategy';
import { environment } from 'src/environments/environment';
// services
import { AuthService } from '../auth.service';
import { EventService } from '../event.service';
import {TranslateLabelService} from '../translate-label.service';
import { saveAs } from 'file-saver';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import {Platform} from "@ionic/angular";

const { Filesystem } = Plugins;

/**
 * Handles all Authorized HTTP functions with Bearer Token
 */
@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  constructor(
    public _http: HttpClient,
    private platform: Platform,
    public _auth: AuthService,
    public eventService: EventService,
    public translateService: TranslateLabelService
  ) { }

  /**
   * Requests via GET verb
   * @param {string} endpointUrl
   * @param {string} withHeader
   * @returns {Observable<any>}
   */
  get(endpointUrl: string, withHeader: boolean = false): Observable<any> {

    const url = environment.apiEndpoint + endpointUrl;

    const response = this._http.get(url, { headers: this._buildAuthHeaders(), observe: 'response' })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1)
      );

    if (!withHeader) {
      return response.pipe(map((res) => {
        return res.body;
      }));
    }

    return response;
  }

  /**
   * Requests via POST verb
   * @param endpointUrl
   * @param params
   * @param withHeader
   */
  post(endpointUrl: string, params: any, withHeader: boolean = false): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;

    const response = this._http.post(url, JSON.stringify(params), { headers: this._buildAuthHeaders(), observe: 'response' })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1)
      );

    if (!withHeader) {
      return response.pipe(map((res) => res.body));
    }
    return response.pipe(map((res) => res));
  }

  /**
   * Requests via PATCH verb
   * @param {string} endpointUrl
   * @param {*} params
   * @returns {Observable<any>}
   */
  patch(endpointUrl: string, params: any): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;

    return this._http.patch(url, JSON.stringify(params), { headers: this._buildAuthHeaders() })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res) => res)
      );
  }

  /**
   * Requests via DELETE verb. Params should be a part of the url string
   * similar to get requests.
   * @param {string} endpointUrl
   * @returns {Observable<any>}
   */
  delete(endpointUrl: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;

    return this._http.delete(url, { headers: this._buildAuthHeaders() })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res) => res)
      );
  }

  /**
   * Requests via PDF GET verb
   * @param {string} endpointUrl
   * @param {string} filename
   * @returns {Observable<any>}
   */
  pdfget(endpointUrl: string, filename: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const bearerToken = this._auth.getAccessToken();

    return this._http.get(url, {
      responseType: 'blob', // ResponseContentType.Blob,  https://github.com/angular/angular/issues/18654#issuecomment-321947661
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + bearerToken
      })
    }).pipe(
        retryWhen(genericRetryStrategy()),
        map((response) => { // download file
          var blob = new Blob([response], { type: 'application/pdf' });
          // file name to dowanload/generate invoice
          if (this.platform.is('ios') && this.platform.is('capacitor')) {
            this.fileWrite(blob, filename);
          } else {
            saveAs(blob, filename);
          }

        })
    );
  }

  async fileWrite(blob, filename) {
    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data: blob,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      })
      console.log('Wrote file', result);
    } catch(e) {
      console.error('Unable to write file', e);
    }
  }
  /**
   * Build the Auth Headers for All Verb Requests
   * @returns {HttpHeaders}
   */
  public _buildAuthHeaders() {
    // Get Bearer Token from Auth Service

    const bearerToken = this._auth.getAccessToken();

    // Build Headers with Bearer Token
    return new HttpHeaders({
      Authorization: 'Bearer ' + bearerToken,
      'Content-Type': 'application/json',
      Language: this.translateService.currentLang
    });
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
      // this.eventService.agentRemoved$.next();
      return empty();
    }

    // Handle No Internet Connection Error

    if (error.status == 0 || error.status == 504) {
      this.eventService.internetOffline$.next();
      // this._auth.logout("Unable to connect to Pogi servers. Please check your internet connection.");
      return empty();
    }

    if (!navigator.onLine) {
      this.eventService.internetOffline$.next();
      return empty();
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this._auth.logout('Session expired, please log back in.');
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
