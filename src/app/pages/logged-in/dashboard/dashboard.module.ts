import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { SplitPipe } from 'src/app/pipes/split.pipe';
import { InvitationModule } from 'src/app/components/invitation/invitation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    InvitationModule,
    DashboardPageRoutingModule
  ],
  declarations: [
    SplitPipe,
    DashboardPage
  ]
})
export class DashboardPageModule {}
