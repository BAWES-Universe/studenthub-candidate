import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, LoadingController, ModalController, Platform, PopoverController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { environment } from 'src/environments/environment';
//import * as cloudinary from "cloudinary-core";    
//services
import { AwsService } from 'src/app/providers/logged-in/aws.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { AuthService } from 'src/app/providers/auth.service';


declare var MediaRecorder;

declare var cloudinary;

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.page.html',
  styleUrls: ['./upload-video.page.scss'],
})
export class UploadVideoPage implements OnInit {

  @ViewChild('player', { static: false }) player: ElementRef;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public candidate;

  public progress = 0;

  public deleting: boolean = false;

  public loading: boolean = false;

  public recording: boolean = false;

  public uploading: boolean = false; 

  public progressInterval; 

  public currentTarget;

  public shouldStop = true;

  public mediaRecorder; 

  public stream;

  public countDown = 0;

  public timer = 0;

  public interval;

  public maxDuration = 30;

  public cameras = [];

  public browserUploadSubscription: Subscription;
  public updateSubscription: Subscription;
  public deleteSubscription: Subscription;

  public format = 'webm';//webm

  constructor(
    private _ngzone: NgZone,
    public platform: Platform,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private mediaCapture: MediaCapture,
    public accountService: AccountService,
    public authService: AuthService,
    public sentryService: SentryErrorhandlerService,
    public translateService: TranslateLabelService,
    public awsService: AwsService
  ) { }

  ngOnInit() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.cameras = devices.filter((d) => d.kind === 'videoinput');
    });

    //on hardware back, cancel recording 
    
    window.onpopstate = e => {
      
      if (window['history-back-from'] == 'onDidDismiss') {
        window['history-back-from'] = null;
        return false;
      }

      //stop recording on hardware back clicked

      if(!this.uploading && !this.shouldStop) {
        this.stopRecording();
        return false;
      }
      
      this.popoverCtrl.getTop().then(overlay => {
        
        if (overlay) {
          this.popoverCtrl.dismiss({
            'from': 'native-back-btn'
          });
        }

        this.modalCtrl.getTop().then(overlay => {

          if (overlay) {
            this.modalCtrl.dismiss({
              'from': 'native-back-btn'
            });
          }
        });
      });
    };

  }

  ionViewDidEnter() {
  
    if(this.candidate.candidate_video) {
      //setTimeout(() => {
        let cld = cloudinary.Cloudinary.new({ cloud_name: 'demo' });
        let demoplayer = cld.videoPlayer('video-player').width(250);      
        demoplayer.source('elephants', {
          "sourceTypes": ["hls"]
        });//this.getVideoPublicId(this.candidate.candidate_video)
      //}, 2000);
    }
  }

  ngOnDestroy() {

    if (!!this.browserUploadSubscription) {
      this.browserUploadSubscription.unsubscribe();
    }

    if (!!this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }

    if(!!this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }

    if(!this.shouldStop)
      this.stopRecording();
  }

  ionViewWillLeave() {
    if(!this.shouldStop) {
      this.stopRecording();
    }
  }

  getVideoPublicId(candidate_video) {
    if(environment.production) {
      return  'candidate-video/' + candidate_video.split('.')[0];
    } 
      
    return  'dev/candidate-video/' + candidate_video.split('.')[0];
  }

  /**
   * start camera in mobile app 
   */
  startCamera() {

    if(this.cameras.length == 0) {
      this.fileInput.nativeElement.click();
    } else if(this.platform.is('hybrid')) {
      this.startCameraInMobile();
    } else {
      this.startCameraInBrowser();
    }
  }

  /**
   * start recording in mobile apps 
   */
  startCameraInMobile() {

    let options: CaptureVideoOptions= { 
      limit: 1,
      duration: 30
    }

    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          this.uploadFileViaNativeFilePath(data[1].fullPath);
        },
        async (err: CaptureError) => {

          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message: this.translateService.transform("txt_recording_error", {
              error: err
            }),
            buttons: [this.translateService.transform('Okay')]
          });

          await alert.present();
        }
      );
  }

  /**
   * start recording in mobile browser 
   */
  startCameraInBrowser() {

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then((stream) => {
              
          window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
    
          this.stream = stream;

          this.shouldStop = false;
  
          const options = { mimeType: 'video/' + this.format };
          const recordedChunks = [];
          
          this.mediaRecorder = new MediaRecorder(stream, options);

          //show live feed 

          setTimeout(() => {

            const player = this.player.nativeElement;
            player.srcObject = stream;
            player.muted = true;
            player.onloadedmetadata = (e) => {
              player.play();
            };
  
          });
          
          this.mediaRecorder.addEventListener('dataavailable', (e) => {
            if (e.data.size > 0 && this.recording) {
              recordedChunks.push(e.data);
            }
          });

          this.mediaRecorder.addEventListener('stop', () => {
            
            //downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
            //downloadLink.download = 'acetest.webm';

            if(recordedChunks.length == 0) {
              return false;
            }

            this.recording = false;

            let file = new File([new Blob(recordedChunks, { type : 'video/' + this.format })], this.authService.id + ".mp4"); 

            this.uploadFile(file, {
              'duration': (this.maxDuration - this.timer) + '',
            });
             
            //no need to cancel recording on hardware back 

            window['history-back-from'] = 'onDidDismiss';
            window.history.back();

          });

          //this.mediaRecorder.start();
        })
        .catch(async (err) => {
          console.log("The following error occurred: " + err);

          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message: this.translateService.transform("txt_recording_error", {
              error: err.name
            }),
            buttons: [this.translateService.transform('Okay')]
          });

          await alert.present();
        });
  }
  
  startCountDown() {

    //window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    this.recording = true;

    this.countDown = 3;

    let countDownTimer = setInterval(() => {
      
      if(this.countDown > 0) {
        this.countDown --;
      }

      if(this.countDown == 0) {
        this.startRecording();

        clearInterval(countDownTimer);
        countDownTimer = null;
      }

    }, 1000);
  }

  startRecording() {

    //start timer 

    this.timer = this.maxDuration;

    //start recorder after count down 

    this.mediaRecorder.start();
    
    this.interval = setInterval(() => {

      //on timeout stop recording 

      if(this.timer == 0)  {
        this.stopRecording();
      }

      if(this.timer > 0)
        this.timer--;
      
    }, 1000);  
  }

  /**
   * stop recording in mobile browser
   */
  stopRecording() {
        
    this.shouldStop = true;

    if(this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if(this.mediaRecorder && this.mediaRecorder.state != "inactive")
      this.mediaRecorder.stop();

    //stop camera 

    if(this.stream)
      this.stream.getTracks().forEach( (track) => {
        track.stop();
      });
  }

  /**
   * Upload video by native path
   */
  async uploadFileViaNativeFilePath(uri) {

    this.uploading = true;

    this.awsService.uploadNativePath(uri).then(o => {
      o.subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        this.progress = 0;

        this.uploading = false;

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
   * Upload video from browser
   * @param event
   */
  async browserUpload(event) {

    const fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }

    this.validateVideoFile(fileList[0]).then(data => {
     
      this.uploadFile(fileList[0]);

    }, err => {
      console.log(err);

      this.alertCtrl.create({
        message: err,
        buttons: [this.translateService.transform('Ok')]
      }).then(alert => { alert.present(); });

    });
  }
    
  validateVideoFile(file) {
    return new Promise((resolve, reject) => {
      try {
          let video = document.createElement('video');
          video.preload = 'metadata'
  
          video.onloadedmetadata = () => {

            if(video.duration > this.maxDuration) {
              reject(this.translateService.transform('Video duration can not exceed 30 second limit'));
            }
            
            resolve(true);
          }
  
          video.onerror = () => {
              reject(this.translateService.transform('Invalid video. Please select a video file.'));
          }

          const type = file.type.split('/')[0];

          if (type != 'video') {
            reject(this.translateService.transform('Invalid File format'))
          }

          video.src = window.URL.createObjectURL(file);

      } catch (e) {
          reject(e);
      }
    });
  }

  uploadFile(file, metadata = {}) {

    this.uploading = true;

    this.browserUploadSubscription = this.awsService.uploadFile(file, metadata).subscribe(event => {
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
      this.uploading = false;
      this.progress = 0;
    }, ()  => {
      this.browserUploadSubscription.unsubscribe();
    });
  }

  /**
   * Handle file upload success
   * @param event 
   */
  public _handleFileSuccess(event) {
    let count = 1;

    if (!this.progressInterval) {

      this.progressInterval = setInterval(() => {
        this._ngzone.run(() => {
          if (count < 100) {
            this.progress = count = count + 1;
          }
        });
      }, 1500);
    }

    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.
    if (event.type === "progress") {
      // This is an upload progress event. Compute and show the % done:
      //this.progress = Math.round(100 * event.loaded / event.total);

    } else if (event.Key && event.Key.length > 0) {

      this.candidate.tempLocation = event.Location;
      this.candidate.candidate_video = event.Key;

      this.progress = 0;
      this.uploading = false;
      clearInterval(this.progressInterval);
      this.progressInterval = null;

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
    this.progress = 0;
    this.uploading = false; 

    if (this.currentTarget) {
      this.currentTarget.abort();
    }
  }

  delete() {

    this.deleting = true;

    this.deleteSubscription = this.accountService.deleteVideo().subscribe(res => {

      this.deleting = false;

      if (res.operation == 'success') {

        this.candidate.tempLocation = null;
        this.candidate.candidate_video = null;

        this.dismiss({
          remove_candidate_video: true
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
      this.deleting = false;
    });
  }
  
  /**
   * save uploaded cv
   */
  async submit() {
    
    this.loading = true;

    this.updateSubscription = this.accountService.updateVideo(this.candidate.candidate_video).subscribe(res => {

      this.progress = 0;
      this.uploading = false;
      this.loading = false;

      if (res.operation == 'success') {

        this.candidate.tempLocation = null;
        this.candidate.candidate_video = res.candidate_video;

        this.dismiss({
          candidate_video: res.candidate_video
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
      this.progress = 0;
      this.loading = false;
      this.uploading = false;
    });
  }
}
