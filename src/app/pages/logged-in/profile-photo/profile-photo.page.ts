import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
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
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.page.html',
  styleUrls: ['./profile-photo.page.scss'],
})
export class ProfilePhotoPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  @ViewChild('btnChangePhoto', { static: false }) btnChangePhoto: IonButton;

  public progress = 0;

  public uploadFileSubscription: Subscription;

  public uploadingPhoto = false;

  public saving = false;
  public loading = false;

  public form: FormGroup;
  public currentTarget;

  public candidate: Candidate;
  public interval;

  public allowedImageSize = 5000000; // in bits 5 MB

  constructor(
    private _ngzone: NgZone,
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
  }

  ngOnInit() {
    window.analytics.page('Profile Photo Page');

    this._initForm();
  }

  /**
   * initialize form
   */
  _initForm() {
    const photo_path = this.candidate.candidate_personal_photo ? this.awsService.cloudinaryUrl + 'candidate-photo/' + this.candidate.candidate_personal_photo : '';

    this.form = this._fb.group({
      personal_photo_path: [photo_path, Validators.required],
      personal_photo: [this.candidate.candidate_personal_photo, Validators.required]
    });
  }

  /**
   * Display options to update logo
   */
  async updatePhoto(ev) {
    if (this.platform.is('capacitor')) {
      this.mobileUpload();
    } else if (this.form.controls.personal_photo.value) {
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
   * Remove profile photo
   */
  removePhoto() {
    this.form.controls.personal_photo_path.setValue(null);
    this.form.controls.personal_photo.setValue(null);
    this.form.updateValueAndValidity();

    this.candidate.candidate_personal_photo = null;

    const removePhotoSubscription = this.accountService.removePhoto().subscribe(() => {
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
          });
        }
      }
    ];

    if (this.form.controls.personal_photo.value) {
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

    this.uploadingPhoto = true;

    this.awsService.uploadNativePath(uri).then(o => {
      o.subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        this.progress = 0;
        clearInterval(this.interval);
        this.uploadingPhoto = false;

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
        buttons: [this.translateService.transform('Ok')]
      }).then(alert => { alert.present(); });
    }else if (fileList[0].size > this.allowedImageSize) {
      this.alertCtrl.create({
        message: this.translateService.transform('Maximum 5mb Upload is allowed'),
        buttons: [this.translateService.transform('Ok')]
      }).then(alert => { alert.present(); });
    } else {

      this.uploadingPhoto = true;

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
        this.uploadingPhoto = false;
        this.progress = 0;
        clearInterval(this.interval);
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
    let count = 1;

    if (!this.interval) {

      this.interval = setInterval(() => {
        this._ngzone.run(() => {
          if (count < 100) {
            this.progress = count = count + 1;
          }
        });
      }, 35);
    }

    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.

    if (event.type === 'progress') {
      // This is an upload progress event. Compute and show the % done:
      // this.progress = Math.round(100 * event.loaded / event.total);
    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement) {
        this.fileInput.nativeElement.value = null;
      }

      this.form.controls.personal_photo_path.setValue(event.Location);
      this.form.controls.personal_photo.setValue(event.Key);
      this.form.controls.personal_photo.markAsDirty();
      this.form.updateValueAndValidity();

      this.progress = 0;
      this.uploadingPhoto = false;
      clearInterval(this.interval);
      this.interval = null;
      
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

    this.accountService.updateProfilePhoto(this.form.controls.personal_photo.value).subscribe(async response => {

      this.saving = false;

      if (response.operation != 'success') {

        const alert = await this.alertCtrl.create({
          message: response.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

      } else {
        this.candidate.candidate_personal_photo = response.candidate_personal_photo;
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

    this.progress = 0;
    clearInterval(this.interval);
    this.loading = false;
    if (this.currentTarget) {
      this.currentTarget.abort();
    }
  }
}
