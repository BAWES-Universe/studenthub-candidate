import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import { WorkLogDayModule } from "../work-log-day/work-log-day.module";
import { WorkHourRejectedComponent } from './work-hour-rejected.component';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    WorkHourRejectedComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule.forChild(),
  //  WorkLogDayModule,
  ],
  exports : [
    WorkHourRejectedComponent
  ]
})
export class WorkHourRejectedModule { }
