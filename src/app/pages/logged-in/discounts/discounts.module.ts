import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountsPageRoutingModule } from './discounts-routing.module';

import { DiscountsPage } from './discounts.page';
import { DiscountDetailPageModule } from './discount-detail/discount-detail.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    DiscountDetailPageModule,
    DiscountsPageRoutingModule
  ],
  declarations: [DiscountsPage]
})
export class DiscountsPageModule {}
