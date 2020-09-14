import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Platform,
  PopoverController,
  AlertController,
  ActionSheetController,
  ModalController,
  IonButton
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
// models
import { Candidate } from 'src/app/models/candidate';
// services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AwsService } from 'src/app/providers/logged-in/aws.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { CameraService } from 'src/app/providers/logged-in/camera.service';
// components
import { PhotoActionComponent } from 'src/app/components/photo-action/photo-action';


@Component({
  selector: 'app-civil-id-front',
  templateUrl: './civil-id-front.page.html',
  styleUrls: ['./civil-id-front.page.scss'],
})
export class CivilIdFrontPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  @ViewChild('btnChangePhoto', { static: false }) btnChangePhoto: IonButton;

  public progress;

  public uploadFileSubscription: Subscription;
  
  public uploadingPhoto = false;

  public saving = false;
  public loading = false;

  public form: FormGroup;
  public currentTarget;

  public candidate: Candidate;
  public cloudinaryUrl;

  constructor(
    private _fb: FormBuilder,
    private platform: Platform,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public accountService: AccountService,
    public awsService: AwsService,
    public sentryService: SentryErrorhandlerService,
    public translateService: TranslateLabelService,
    private _cameraService: CameraService
  ) {
    this.cloudinaryUrl = environment.cloudinaryUrl + 'candidate-photo/';
  }

  ngOnInit() {
    this._initForm();
  }

  /**
   * initialize form
   */
  _initForm() {
    this.form = this._fb.group({
      civil_photo_front_path: [this.candidate.candidate_civil_photo_front ? this.awsService.permanentBucketUrl + 'photos/' + this.candidate.candidate_civil_photo_front : '', Validators.required],
      civil_photo_front: [this.candidate.candidate_civil_photo_front, Validators.required]
    });
  }

  /**
   * Display options to update logo
   */
  async updatePhoto(ev) {
    if (this.platform.is('capacitor')) {
      this.mobileUpload();
    } else if (this.form.controls.civil_photo_front.value) {
      const popover = await this.popoverCtrl.create(
        {
          component: PhotoActionComponent,
          componentProps: {
            fileInput: this.fileInput.nativeElement
          },
          event: ev
        }
      );
      popover.present();
      popover.onDidDismiss().then(e => {

        if (!e.data) {
          return null;
        }

        if (e.data && e.data.action === 'remove') {
          return this.removePhoto();
        }
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * Remove photo
   */
  removePhoto() {
    this.form.controls.civil_photo_front_path.setValue(null);
    this.form.controls.civil_photo_front.setValue(null);
    this.form.updateValueAndValidity();

    this.candidate.candidate_civil_photo_front = null;

    const removePhotoSubscription = this.accountService.removeCivilPhotoFront().subscribe(() => {
      removePhotoSubscription.unsubscribe();
    });
  }

  /**
   * Upload logo from mobile
   */
  mobileUpload() {

    const SelectSourceLbl = this.translateService.transform('Select image source');
    const LoadLibLbl = this.translateService.transform('Load from Library');
    const UseCamLbl = this.translateService.transform('Use Camera');

    const arrButtons = [
      {
        text: LoadLibLbl,
        handler: () => {
       
          this._cameraService.getImageFromLibrary().then((nativeImageFilePath) => {
            // Upload and process for progress
            this.uploadFileViaNativeFilePath(nativeImageFilePath);
          }, async (err) => {

            const ignoreErrors = [
              'No image picked',
              'User cancelled photos app'
            ];

            if (err && ignoreErrors.indexOf(err.message) > -1) {
                return null;
            }

            const alert = await this.alertCtrl.create({
              header: this.translateService.transform('Error getting picture from Library'),
              message: err.message,
              buttons: [this.translateService.transform('Okay')]
            });

            await alert.present();
            this.progress = null;
          });
        }
      },
      {
        text: UseCamLbl,
        handler: () => {
         
          this._cameraService.getImageFromCamera().then((nativeImageFilePath) => {
            // Upload and process for progress
            this.uploadFileViaNativeFilePath(nativeImageFilePath);
          }, async (err) => {

            const ignoreErrors = [
              'No image picked',
              'User cancelled photos app'
            ];

            if (err && ignoreErrors.indexOf(err.message) > -1) {
                return null;
            }

            const alert = await this.alertCtrl.create({
              header: this.translateService.transform('Error getting picture from Library'),
              message: err.message,
              buttons: [this.translateService.transform('Okay')]
            });

            await alert.present();
            this.progress = null;
          });
        }
      }
    ];

    if (this.form.controls.civil_photo_front.value) {
      arrButtons.push({
        text: this.translateService.transform('Remove Photo'),
        handler: () => {
          this.removePhoto();
        }
      });
    }

    // Display action sheet giving user option of camera vs local filesystem.
    this.actionSheetCtrl.create({
      header: SelectSourceLbl,
      buttons: arrButtons
    }).then(actionSheet => actionSheet.present());
  }

  /**
   * Upload logo by native path
   */
  async uploadFileViaNativeFilePath(uri) {
    this.progress = 1;//show loader

    this.awsService.uploadNativePath(uri).then(o => {
      o.subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        this.progress = false;

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

        // log to slack/sentry to know how many user getting file upload error

        this.sentryService.handleError(err);

        // always show abstract error message

        let message;

        const networkErrors = [
          '504:null',
          'NetworkingError: Network Failure'
        ];

        // networking errors
        if (err && networkErrors.indexOf(err.message) > -1) {
          message = this.translateService.transform('Error uploading file');
        // system errors
        } else if (err.message && err.message.indexOf(':') > -1) {
          message = this.translateService.transform('Error getting file from Library');
        // plugin errors
        } else if (err.message) {
          message = err.message;
        // custom file validation errors
        } else {
          message = err;
        }

        const alert = await this.alertCtrl.create({
          header: this.translateService.transform('Error'),
          message,
          buttons: [this.translateService.transform('Okay')]
        });

        await alert.present();
      });
    });
  }

  /**
   * Upload logo from browser
   * @param event
   */
  async browserUpload(event) {

    const fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }

    const prefix = fileList[0].name.split('.')[0];

    const type = fileList[0].type.split('/')[0];

    if (type != 'image') {
      this.alertCtrl.create({
        message: this.translateService.transform('Invalid File format'),
        buttons: [this.translateService.transform('Okay')]
      }).then(alert => { alert.present(); });
    }
    else
    {
      this.progress = 1;

      this.uploadFileSubscription = this.awsService.uploadFile(fileList[0]).subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        if (!err.message || !err.message.includes('aborted')) {

          // log to sentry

          this.sentryService.handleError(err);
          
          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message: this.translateService.transform('Error while uploading file!'),
            buttons: [this.translateService.transform('Okay')]
          });

          await alert.present();
        }

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = null;
        }

        this.progress = false;
      }, () => {
        this.uploadFileSubscription.unsubscribe();
      });
    }
  }

  /**
   * Handle logo upload api response
   * @param event
   */
  _handleFileSuccess(event) {
    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.
    if (event.type === 'progress') {
      // This is an upload progress event. Compute and show the % done:
      this.progress = Math.round(100 * event.loaded / event.total);
    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement) {
        this.fileInput.nativeElement.value = null;
      }

      const imgLarge = new Image();
      imgLarge.src = event.Location;
      imgLarge.onload = () => {

        this.form.controls.civil_photo_front_path.setValue(event.Location);
        this.form.controls.civil_photo_front.setValue(event.Key);
        this.form.controls.civil_photo_front.markAsDirty();
        this.form.updateValueAndValidity();

        this.accountService.updateCivilPhotoFront(event.Key).subscribe(async response => {
          if (response.operation != 'success') {
            const alert = await this.alertCtrl.create({
              message: response.message,
              buttons: [this.translateService.transform('Okay')],
            });
            alert.present();

            this.progress = null;
            
          } else  {
            this.candidate.candidate_civil_photo_front = response.candidate_civil_photo_front;
            this.dismiss();
          }
        });
      };
    } else if (!this.currentTarget) {
        this.currentTarget = event;
    }
  }

  /**
   * trigger click event on change logo button
   */
  triggerUpdatePhoto($event) {
    $event.stopPropagation();
    document.getElementById('upload-pic').click();
    // this.fileInput.nativeElement.click();
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  /**
   * save profile photo
   */
  submit() {
    this.saving = true;

    this.accountService.updateCivilPhotoFront(this.form.value.civil_photo_front).subscribe(res => {
      this.saving = false;

      if (res.operation == 'success') {
        this.dismiss();
      }
    }, () => {
      this.saving = false;
    });
  }

  /**
   * cancel file upload
   */
  cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.progress = null;

    this.loading = false;
    if (this.currentTarget) {
      this.currentTarget.abort();
    }
  }
}
