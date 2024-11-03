import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateAssignmentPageRoutingModule } from './candidate-assignment-routing.module';

import { CandidateAssignmentPage } from './candidate-assignment.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'ion2-calendar';
import { DatePickerModule } from 'src/app/components/date-picker/date-picker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    CalendarModule,
    DatePickerModule,
    TranslateModule.forChild(),
    CandidateAssignmentPageRoutingModule
  ],
  declarations: [CandidateAssignmentPage]
})
export class CandidateAssignmentPageModule {}
