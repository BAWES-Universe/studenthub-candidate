import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkSessionApprovedComponent } from './work-session-approved.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    WorkSessionApprovedComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports: [
    WorkSessionApprovedComponent
  ]
})
export class WorkSessionApprovedModule { }
