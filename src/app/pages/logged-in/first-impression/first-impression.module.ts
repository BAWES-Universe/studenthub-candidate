import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstImpressionPageRoutingModule } from './first-impression-routing.module';

import { FirstImpressionPage } from './first-impression.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    FirstImpressionPageRoutingModule
  ],
  declarations: [FirstImpressionPage]
})
export class FirstImpressionPageModule {}
