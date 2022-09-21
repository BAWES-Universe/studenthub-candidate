import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { WorkingCounterComponent } from './working-counter.component';
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
    declarations: [WorkingCounterComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule,
        PipesModule
    ],
    exports: [WorkingCounterComponent],
})
export class WorkingCounterModule { }
