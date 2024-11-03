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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkHourApprovedModule,
    WorkHourRejectedModule,
    InvitationModule,
    AssignedModule,
    UnassignedModule,
    NoItemsModule,
    TranslateModule.forChild(),
    ActivityPageRoutingModule
  ],
  declarations: [ActivityPage]
})
export class ActivityPageModule {}
