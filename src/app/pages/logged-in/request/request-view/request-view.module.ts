import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestViewPageRoutingModule } from './request-view-routing.module';

import { RequestViewPage } from './request-view.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RequestViewPageRoutingModule
  ],
  declarations: [RequestViewPage]
})
export class RequestViewPageModule {}
