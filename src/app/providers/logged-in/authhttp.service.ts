import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, empty, throwError } from 'rxjs';
import { catchError, take, map, retryWhen } from 'rxjs/operators';
import { genericRetryStrategy } from '../../util/genericRetryStrategy';
import { environment } from 'src/environments/environment';
// services
import { AuthService } from '../auth.service';
import { EventService } from '../event.service';
import { TranslateLabelService } from '../translate-label.service';
import { saveAs } from 'file-saver';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { Platform } from "@ionic/angular";
import { FileOpener } from "@ionic-native/file-opener/ngx";

const { Filesystem, Storage } = Plugins;

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
    public translateService: TranslateLabelService,
    private fileOpener: FileOpener
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
        map(async (response) => { // download file
          var blob = new Blob([response], { type: 'application/pdf' });
          // file name to dowanload/generate invoice

          console.log('pdfget');
          if (this.platform.is('ios') && this.platform.is('capacitor')) {
            console.log('ios capacitor');
            console.log('blob',blob);
            console.log('response',response);

            const base64 = await this.convertBlobToBase64(blob);
            console.log('converted',base64);
            await this.fileWrite(base64, filename)
            console.log('fileWrite');
          } else {
            saveAs(blob, filename);
          }
        })
    );
  }

  public convertBlobToBase64 = async (blob) => { // blob data
    return await this.blobToBase64(blob);
  }

  public blobToBase64 = (blob:Blob) => new Promise((resolve, reject) => {
    let reader = new FileReader();

    if (blob instanceof Blob) {
      const realFileReader = (reader as any)._realReader;
      if (realFileReader) {
        reader = realFileReader;
      }
    }

    reader.readAsDataURL(blob);
    reader.onload = async (data) => {
      resolve(reader.result);
    }
    reader.onerror = error => {
      console.log('error',error);
      reject(error);
    }
  });

  /**
   * @param name
   * @private
   */
  private getMimeType(name) {
    if (name.indexOf('pdf') >= 0) {
      return 'application/pdf';
    } else if (name.indexOf('png') >= 0) {
      return 'image/png';
    } else if (name.indexOf('mp4') >= 0) {
      return 'video/mp4';
    }
  }

  async fileWrite(blob, filename) {
    console.log('fileWrite', filename);
    try {
      const saveFile = await Filesystem.writeFile({
        path: filename,
        data: blob,
        directory: FilesystemDirectory.Documents
      })
      const path = saveFile.uri;
      const mimeType = this.getMimeType(filename);
      console.log('mimeType', mimeType);
      console.log('Wrote file', saveFile);
      this.fileOpener.open(path, mimeType)
        .then(() => console.log('file is opened'))
        .catch(err => console.error(err));

    } catch(e) {
      console.error('Unable to write file', e);
    }
  }

  /**
   * helper function to convert block into base64
   * @param blob
   */
  private convertBlockToBase64 = async (blob: Blob) => new Promise((resolve, reject) => {
    console.log(blob);
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.readAsDataURL(blob);
  });

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
