import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketListPageRoutingModule } from './ticket-list-routing.module';

import { TicketListPage } from './ticket-list.page';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {LoadingModalModule} from '../../../../components/loading-modal/loading-modal.module';
import {TranslateModule} from "@ngx-translate/core";
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoItemsModule,
    CKEditorModule,
    LoadingModalModule,
    TranslateModule.forChild(),
    TicketListPageRoutingModule
  ],
  declarations: [TicketListPage]
})
export class TicketListPageModule {}
