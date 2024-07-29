import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketViewPageRoutingModule } from './ticket-view-routing.module';

import { TicketViewPage } from './ticket-view.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CKEditorModule,
    TranslateModule.forChild(),
    TicketViewPageRoutingModule
  ],
  declarations: [TicketViewPage]
})
export class TicketViewPageModule {}
