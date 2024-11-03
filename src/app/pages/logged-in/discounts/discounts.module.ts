import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountsPageRoutingModule } from './discounts-routing.module';

import { DiscountsPage } from './discounts.page';
import { DiscountDetailPageModule } from './discount-detail/discount-detail.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoItemsModule,
    TranslateModule.forChild(),
    DiscountDetailPageModule,
    DiscountsPageRoutingModule
  ],
  declarations: [DiscountsPage]
})
export class DiscountsPageModule {}
