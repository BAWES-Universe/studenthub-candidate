import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CivilIdBackPageRoutingModule } from './civil-id-back-routing.module';

import { CivilIdBackPage } from './civil-id-back.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CivilIdBackPageRoutingModule
  ],
  declarations: [CivilIdBackPage]
})
export class CivilIdBackPageModule {}
