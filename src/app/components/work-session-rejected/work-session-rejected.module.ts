import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkSessionRejectedComponent } from './work-session-rejected.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    WorkSessionRejectedComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports: [
    WorkSessionRejectedComponent
  ]
})
export class WorkSessionRejectedModule { }
