import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KuwaitiNationalPageRoutingModule } from './kuwaiti-national-routing.module';

import { KuwaitiNationalPage } from './kuwaiti-national.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    KuwaitiNationalPageRoutingModule
  ],
  declarations: [KuwaitiNationalPage]
})
export class KuwaitiNationalPageModule {}
