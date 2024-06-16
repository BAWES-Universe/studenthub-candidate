import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadVideoPageRoutingModule } from './upload-video-routing.module';

import { UploadVideoPage } from './upload-video.page';
import { TranslateModule } from '@ngx-translate/core';
//import { CloudinaryModule } from '@cloudinary/angular-5.x';
//import * as Cloudinary from 'cloudinary-core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
   // CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'studenthub'}),
    UploadVideoPageRoutingModule
  ],
  declarations: [UploadVideoPage]
})
export class UploadVideoPageModule {}
