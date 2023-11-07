import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, ModalController, Platform } from '@ionic/angular';
//services
import { FilepickerService } from 'src/app/providers/logged-in/filepicker.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.page.html',
  styleUrls: ['./upload-cv.page.scss'],
})
export class UploadCvPage implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public candidate;

  public progress = 0;

  public loading: boolean = false;

  public uploadingCv: boolean = false; 

  public currentTarget;

  public filePickSubscription: Subscription;
  public browserUploadSubscription: Subscription;
  public uploadSubscription: Subscription;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public sentryService: SentryErrorhandlerService,
    public filepickerService: FilepickerService,
    public awsService: AwsService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Upload CV Page');
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Upload CV Page'
    });
  }

  ngOnDestroy() {

    if (!!this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }

    if (!!this.filePickSubscription) {
      this.filePickSubscription.unsubscribe();
    }

    if (!!this.browserUploadSubscription) {
      this.browserUploadSubscription.unsubscribe();
    }
  }

  /**
   * is given extension is valid/allowed for file upload 
   * @param extension 
   */
  isValidExtension(extension) {

    let allowedExtensions = [];

    let arrExt = ['pdf'];

    for (let ext of arrExt) {
      allowedExtensions.push(ext.replace('.', ''));
    }

    return allowedExtensions.indexOf(extension) > -1;
  }

  /**
   * Upload file in mobile device
   */
  mobileUpload() {
    this.filePickSubscription = this.filepickerService.pick().subscribe(async uri => {
      //validate extension 

      /*let extension = uri.split('.').pop();

      if(!this.isValidExtension(extension)) {

          const alert = await this._alertCtrl.create({
              header: this.translateService.transform('Invalid file'),
              message: this.translateService.transform('txt_invalid_file_format', { value: this.allwedFormats() }),
              buttons: [this.translateService.transform('Okay')]
          });

          return alert.present();
      }*/

      this.uploadingCv = true;

      this.awsService.uploadNativePath(uri, 'doc').then(o => {
        o.subscribe(event => {
          this._handleFileSuccess(event);
        }, async err => {

          this.uploadingCv = false;

          this.progress = 0;

          const ignoreErrors = [
            'No image picked',
            'User cancelled photos app',
          ];

          if (
            err && (
              ignoreErrors.indexOf(err.message) > -1 ||
              err.message.includes('aborted')
            ) 
          ) {
            return null;
          }

          //log to slack/sentry to know how many user getting file upload error 

          this.sentryService.handleError(err);

          //always show abstract error message 

          let message;

          const networkErrors = [
            '504:null',
            'NetworkingError: Network Failure'
          ];

          //networking errors
          if (err && networkErrors.indexOf(err.message) > -1) {
            message = this.translateService.transform('Error uploading file');
            //system errors 
          } else if (err.message && err.message.indexOf(':') > -1) {
            message = this.translateService.transform('Error getting file from Library');
            //plugin errors
          } else if (err.message) {
            message = err.message;
            //custom file validation errors   
          } else {
            message = err;
          }

          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message: message,
            buttons: [this.translateService.transform('Okay')]
          });

          await alert.present();
        });
      });
    });
  }

  /**
   * Upload file in browser platform
   * @param event 
   */
  browserUpload(event) {
    console.log('browserUpload');
    let fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }

    this.uploadingCv = true;

    this.browserUploadSubscription = this.awsService.uploadFile(fileList[0]).subscribe(event => {
      this._handleFileSuccess(event);
    },
    async err => {

      if (!err.message || !err.message.includes('aborted')) {
        //log to slack/sentry to know how many user getting file upload error 

        this.sentryService.handleError(err);

        const alert = await this.alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: this.translateService.transform('Error while uploading file!'),
          buttons: [this.translateService.transform('Okay')]
        });

        await alert.present();
      }
      
      if (this.fileInput && this.fileInput.nativeElement)
        this.fileInput.nativeElement.value = null;

      this.progress = 0;
      this.uploadingCv = false;
    });
  }

  /**
   * Handle file upload success
   * @param event 
   */
  public _handleFileSuccess(event) {

    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.
    if (event.type === "progress") {
      // This is an upload progress event. Compute and show the % done:
      this.progress = Math.round(100 * event.loaded / event.total);

    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement)
        this.fileInput.nativeElement.value = null;

      this.candidate.tempLocation = event.Location;
      this.candidate.candidate_resume = event.Key;

      this.progress = 0;
      this.uploadingCv = false;

    } else if (!this.currentTarget) {
      this.currentTarget = event;
    }
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }

  /**
   * cancel file upload 
   */
  cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement)
      this.fileInput.nativeElement.value = null;

    this.progress = 0;
    this.uploadingCv = false; 

    if (this.currentTarget) {
      this.currentTarget.abort();
    }
  }

  /**
   * return extension of uploaded file 
   */
  get uploadedFileExtension() {
    const resume = this.candidate.tempLocation ? this.candidate.tempLocation: this.candidate.candidate_resume;

    let a = resume.split('.');

    if (a)
      return a[a.length - 1];
  }

  /**
   * save uploaded cv
   */
  submit() {

    this.loading = true;

    this.uploadSubscription = this.accountService.updateResume(this.candidate.candidate_resume).subscribe(res => {

      this.loading = false;

      if (res.operation == 'success') {

        this.candidate.tempLocation = null;
        this.candidate.candidate_resume = res.candidate_resume;

        this.dismiss({
          candidate_resume: res.candidate_resume
        });
        
      } else {

        this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    }, () => {
      this.loading = false;
    });
  }

  getResumeUrl(candidate) {
    return this.awsService.permanentBucketUrl + 'candidate-resume/' + encodeURIComponent(candidate.candidate_resume);
  }
}
