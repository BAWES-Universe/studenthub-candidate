import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { InvitationDetailPageRoutingModule } from './invitation-detail-routing.module';

import { InvitationDetailPage } from './invitation-detail.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { InvitationModule } from 'src/app/components/invitation/invitation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    InvitationModule,
    InvitationDetailPageRoutingModule
  ],
  declarations: [
    InvitationDetailPage
  ]
})
export class InvitationDetailPageModule {}
