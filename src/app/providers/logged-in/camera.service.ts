import { Injectable } from "@angular/core";
import { Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraOptions } from '@capacitor/core';


const { Camera } = Plugins;

@Injectable({ providedIn: 'root' })
export class CameraService {

  constructor(
    private _platform: Platform
  ) {
    // Cleanup Temporary Camera Files on iOS on app load
    //if (this._platform.is('ios')) {
    //    this._camera.cleanup();
    //}
  }

  /**
   * Opens Camera and returns native file path on selection
   * @returns {Promise<string>} native file path
   */
  getImageFromCamera() {
    return this.getFileFromSource(CameraSource.Camera);
  }

  /**
   * Opens Library and returns native file path on selection
   * @returns {Promise<string>} native file path
   */
  getImageFromLibrary() {
    return this.getFileFromSource(CameraSource.Photos);
  }

  /**
   * Loads specified source (Camera/Photo Library) to get file 
   * which returns a promise of string with native file path
   * @returns native file path
   */
  async getFileFromSource(sourceType) {
    // Get picture from selected source
    let cameraOptions = this._getCameraOptions(sourceType);
    const image = await Camera.getPhoto(cameraOptions);
    return image.path;
  }

  /**
   * Gets camera options based on the device plugin support
   * @param  {} sourceType
   * @returns CameraOptions
   */
  private _getCameraOptions(sourceType): CameraOptions {

    if (this._platform.is("android")) {
      return {
        quality: 100,
        source: sourceType,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        correctOrientation: true
        //encodingType: this._camera.EncodingType.JPEG,
        //mediaType: this._camera.MediaType.PICTURE,                
      };
    }

    return {
      quality: 100,
      source: sourceType,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      //encodingType: this._camera.EncodingType.JPEG,
      //mediaType: this._camera.MediaType.PICTURE
    };
  }
}
