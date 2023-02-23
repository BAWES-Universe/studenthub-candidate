import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Observer } from "rxjs";
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { DocumentPicker } from '@awesome-cordova-plugins/document-picker/ngx';

/**
 * Select plugins based on platform to select files to upload
 */
@Injectable({
    providedIn: 'root'
})
export class FilepickerService {

    constructor(
        private filePicker: DocumentPicker,
        public fileChooser: FileChooser,
        private filePath: FilePath,
        public platform: Platform
    ) { }

    /**
     * Return file path to upload file
     */
    pick() {
        if (this.platform.is('ios')) {
            return this.pickForIos();
        } else {
            return this.pickForAndroid();
        }
    }

    /**
     * Open fileChooser for Android
     */
    pickForAndroid() {
        return Observable.create((observer: Observer<any>) => {
            this.fileChooser.open().then(uri => {

                this.filePath.resolveNativePath(uri)
                    .then(filePath => {
                        observer.next(filePath);
                        observer.complete();
                    })
                    .catch(err => observer.error(err));
            });
        });
    }

    /**
     * Open FilePicker for iOS
     */
    pickForIos(){
        return Observable.create((observer: Observer<any>) => {
            this.filePicker.getFile('all')
                .then(uri => {
                    observer.next(uri);
                    observer.complete();
                })
                .catch(err => {
                    console.error('Error', err);
                });
        });
    }
}

