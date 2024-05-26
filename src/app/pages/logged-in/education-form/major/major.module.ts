import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MajorPageRoutingModule } from './major-routing.module';

import { MajorPage } from './major.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    TranslateModule.forChild(),
    MajorPageRoutingModule
  ],
  declarations: [MajorPage]
})
export class MajorPageModule {}
