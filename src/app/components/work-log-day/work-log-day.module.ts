import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkLogDayComponent } from "./work-log-day.component";
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WorkLogDayComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    PipesModule,
    RouterModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class WorkLogDayModule { }
