import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountDetailPageRoutingModule } from './discount-detail-routing.module';

import { DiscountDetailPage } from './discount-detail.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    //DiscountDetailPageRoutingModule
  ],
  declarations: [DiscountDetailPage]
})
export class DiscountDetailPageModule {}
