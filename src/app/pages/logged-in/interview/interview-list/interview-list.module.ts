import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewListPageRoutingModule } from './interview-list-routing.module';

import { InterviewListPage } from './interview-list.page';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { TranslateModule } from '@ngx-translate/core';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NoItemsModule,
    RequestListingModule,
    TranslateModule.forChild(),
    IonicModule,
    InterviewListPageRoutingModule
  ],
  declarations: [InterviewListPage]
})
export class InterviewListPageModule {}
