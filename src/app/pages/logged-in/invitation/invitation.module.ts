import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { InvitationPageRoutingModule } from './invitation-routing.module';

import { InvitationPage } from './invitation.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { InvitationModule } from 'src/app/components/invitation/invitation.module';
import {WorkingCounterModule} from "../../../components/working-counter/working-counter.module";
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    InvitationModule,
    NoItemsModule,
    InvitationPageRoutingModule,
    WorkingCounterModule
  ],
  declarations: [
    InvitationPage
  ]
})
export class InvitationPageModule {}
