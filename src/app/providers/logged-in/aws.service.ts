import { Injectable } from '@angular/core';
import { File as NativeFile, Entry, FileEntry } from '@ionic-native/file/ngx';
import { Observable, Observer } from 'rxjs';
import * as AWS from 'aws-sdk';
import { Plugins } from '@capacitor/core';
import { Platform, AlertController } from '@ionic/angular';
// services
import { TranslateLabelService } from '../translate-label.service';
import { environment } from 'src/environments/environment';


const { Filesystem, FilesystemEncoding } = Plugins;

@Injectable({
    providedIn: 'root'
})
export class AwsService {

    public permanentBucketUrl = environment.permanentBucketUrl;

    private _region = 'eu-west-2'; // London
    private _access_key_uuid = 'AKIAJXOMRCDE65WKBPUA';
    private _secret_access_key = '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';
    private _bucket_name = 'studenthub-public-anyone-can-upload-24hr-expiry';

    public maxUploadSize = 18874368; // 18 MB

    public txtMaxUploadSize = '18MB';

    constructor(
        public platform: Platform,
        public alertController: AlertController,
        private _file: NativeFile,
        public translateService: TranslateLabelService,
    ) {
        this.initAwsService();
    }

    /**
     * Initialize the AWS Service
     */
    initAwsService(){
        AWS.config.region = this._region;
        AWS.config.accessKeyId = this._access_key_uuid;
        AWS.config.secretAccessKey = this._secret_access_key;
    }

    /**
     * Files available in native filesystem need additional processing
     * before they are ready to be uploaded to S3. This function will create
     * a JS File blob that is ready to be accepted via AWS S3 SDK.
     * @param  { any } nativeFilePath
     * @returns Promise
     */
    uploadNativePath(nativeFilePath): Promise<Observable<any>>{
        return new Promise((resolve, reject) => {

            // Resolve File Path on System

            this._file.resolveLocalFilesystemUrl(nativeFilePath).then((entry: Entry) => {

                // Convert entry into File Entry which can output a JS File object
                let fileEntry =  entry as FileEntry;

                // Return a File object that represents the current state of the file that this FileEntry represents
                fileEntry.file(async (file: any) => {

                    // Store File Details for later use
                    let fileName = file.name;
                    let fileType = file.type;
                    let fileLastModified = file.lastModifiedDate;

                    let fileReadResult;

                    try
                    {
                        fileReadResult = await Filesystem.readFile({
                            path: nativeFilePath,
                            //encoding: FilesystemEncoding.UTF8
                        });
                    }
                    catch(err)
                    {
                        let message = err && err.message? err.message: this.translateService.transform("Error reading file");

                        const alert = await this.alertController.create({
                            header: this.translateService.transform('Error'),
                            message: message,
                            buttons: [this.translateService.transform('Okay')]
                        });

                        await alert.present();

                        return reject("Error reading file: " + JSON.stringify(err));
                    }

                    //var blob = new Blob([fileReadResult.data], { type: fileType });
                    var file: any = this.b64toBlob(fileReadResult.data, fileType);// blob;//, fileType);//blob;
                    file.name = fileName;
                    file.lastModifiedDate = fileLastModified;

                    // Resolve an Observable for File Uploading

                    resolve(this.uploadFile(file));

                }, (error) => {
                    reject("Unable to retrieve file properties: " + JSON.stringify(error));
                });
            }).catch(err => {
                reject("Error resolving file: " + JSON.stringify(err));
            });
        });
    }

    /**
     * convert base64 data to Blob object
     * @param b64Data
     * @param contentType
     * @param sliceSize
     */
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * Upload file to Amazon S3, return an observable to monitor progress
     * @param { File } file
     * @returns { Observable<any> }
     */
    uploadFile(file: File = null): Observable<any> {

        let s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        });

        let extension = this._getFileExtension(file.name);

        let prefix = this._getFileNameWithoutExtension(file.name);

        let key = prefix + "-" + Date.now() + "." + extension;

        let params = {
            Body: file, // the actual file file
            ACL: "public-read", // to allow public access to the file
            Bucket: this._bucket_name, //bucket name
            Key: key, //file name
            ContentType: file.type, //(String) A standard MIME type describing the format of the object file
        }

        return Observable.create((observer: Observer<any>) => {

            if(file.size > this.maxUploadSize) {
                return observer.error(this.translateService.transform('txt_max_upload_limit_exceed', { 'maxUploadSize': this.txtMaxUploadSize }));
            }

            s3.upload(params).on('httpUploadProgress', (progress: ProgressEvent) => {
                observer.next(progress);
            }).send((err, data) => {

                if(err) {
                    observer.error(err);
                } else {
                    observer.next(data);
                }
            });
        });
    }

    /**
     * Take file name / path and return the file name without extension.
     */
    private _getFileNameWithoutExtension(path) {
        let basename = path.split(/[\\/]/).pop(),  // extract file name from full path ... (supports `\\` and `/` separators)

        pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return this.normalizeFileName(basename.slice(0, pos));            // extract file name ignoring `.` without extension
    }

    /**
     * replace space in name with `-`
     * @param fileName
     */
    normalizeFileName(fileName) {
        return fileName.replace(/ /g, "-").replace(/%20/g, "-");
    }

    /**
     * Take file name / path and return the file extension.
     */
    private _getFileExtension(path) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                                                // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }
}
