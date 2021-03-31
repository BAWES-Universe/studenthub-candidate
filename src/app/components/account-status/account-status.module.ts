import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AccountStatusComponent } from './account-status.component';
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';


@NgModule({
    declarations: [AccountStatusComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule
    ],
    exports: [AccountStatusComponent]
})
export class AccountStatusModule { }
