import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadVideoPageRoutingModule } from './upload-video-routing.module';

import { UploadVideoPage } from './upload-video.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    UploadVideoPageRoutingModule
  ],
  declarations: [UploadVideoPage]
})
export class UploadVideoPageModule {}
