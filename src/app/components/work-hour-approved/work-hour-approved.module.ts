import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import { WorkLogDayModule } from "../work-log-day/work-log-day.module";
import {WorkHourApprovedComponent } from "./work-hour-approved.component";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    WorkHourApprovedComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule.forChild(),
 //   WorkLogDayModule,
  ],
  exports: [
    WorkHourApprovedComponent
  ]
})
export class WorkHourApprovedModule { }
