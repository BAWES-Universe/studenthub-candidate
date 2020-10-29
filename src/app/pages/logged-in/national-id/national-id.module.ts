import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NationalIdPageRoutingModule } from './national-id-routing.module';

import { NationalIdPage } from './national-id.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    NationalIdPageRoutingModule
  ],
  declarations: [NationalIdPage]
})
export class NationalIdPageModule {}
