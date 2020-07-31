import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrivingLicensePageRoutingModule } from './driving-license-routing.module';

import { DrivingLicensePage } from './driving-license.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    DrivingLicensePageRoutingModule
  ],
  declarations: [DrivingLicensePage]
})
export class DrivingLicensePageModule {}
