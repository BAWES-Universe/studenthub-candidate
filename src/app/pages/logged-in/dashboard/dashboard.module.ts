import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { InvitationModule } from 'src/app/components/invitation/invitation.module';
import {AccountStatusModule} from 'src/app/components/account-status/account-status.module';
import {WorkingCounterModule} from "../../../components/working-counter/working-counter.module";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild(),
        LoadingModalModule,
        InvitationModule,
        DashboardPageRoutingModule,
        AccountStatusModule,
        WorkingCounterModule,
        PipesModule
    ],
    declarations: [
        DashboardPage
    ]
})
export class DashboardPageModule {}
