import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePhotoPageRoutingModule } from './profile-photo-routing.module';

import { ProfilePhotoPage } from './profile-photo.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ProfilePhotoPageRoutingModule
  ],
  declarations: [ProfilePhotoPage]
})
export class ProfilePhotoPageModule {}
