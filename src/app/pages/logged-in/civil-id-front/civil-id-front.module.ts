import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CivilIdFrontPageRoutingModule } from './civil-id-front-routing.module';

import { CivilIdFrontPage } from './civil-id-front.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CivilIdFrontPageRoutingModule
  ],
  declarations: [CivilIdFrontPage]
})
export class CivilIdFrontPageModule {}
