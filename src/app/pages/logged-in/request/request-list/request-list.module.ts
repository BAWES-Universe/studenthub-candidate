import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestListPageRoutingModule } from './request-list-routing.module';

import { RequestListPage } from './request-list.page';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoItemsModule,
    TranslateModule.forChild(),
    RequestListingModule,
    RequestListPageRoutingModule
  ],
  declarations: [RequestListPage]
})
export class RequestListPageModule {}
