import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileUrlRoutingModule } from './profile-url-routing.module';

import { ProfileUrlPage } from './profile-url.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ProfileUrlRoutingModule
  ],
  declarations: [ProfileUrlPage]
})
export class ProfileUrlPageModule {}
