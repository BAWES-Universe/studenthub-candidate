import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPageRoutingModule } from './activity-routing.module';

import { ActivityPage } from './activity.page';
import { UnassignedModule } from "../../../components/unassigned/unassigned.module";
import { AssignedModule } from "../../../components/assigned/assigned.module";
import { WorkHourApprovedModule } from "../../../components/work-hour-approved/work-hour-approved.module";
import { WorkHourRejectedModule } from "../../../components/work-hour-rejected/work-hour-rejected.module";
import { InvitationModule } from "../../../components/invitation/invitation.module";
import { TranslateModule } from '@ngx-translate/core';
import { NoItemsModule } from "../../../components/no-items/no-items.module";
import { TransferUnpaidModule } from '../../../components/transfer-unpaid/transfer-unpaid.module';
import { TransferPaidModule } from '../../../components/transfer-paid/transfer-paid.module';
import { TransferInitModule } from '../../../components/transfer-init/transfer-init.module';
import { InvitationNotificationModule }from '../../../components/invitation-notification/invitation-notification.module';
import { WorkSessionRejectedModule } from "../../../components/work-session-rejected/work-session-rejected.module";
import { WorkSessionApprovedModule } from "../../../components/work-session-approved/work-session-approved.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkSessionRejectedModule,
    WorkSessionApprovedModule,
    WorkHourApprovedModule,
    WorkHourRejectedModule,
    //InvitationModule,
    InvitationNotificationModule,
    AssignedModule,
    UnassignedModule,
    NoItemsModule,
    TransferUnpaidModule,
    TransferPaidModule,
    TransferInitModule,
    TranslateModule.forChild(),
    ActivityPageRoutingModule
  ],
  declarations: [ActivityPage]
})
export class ActivityPageModule {}
