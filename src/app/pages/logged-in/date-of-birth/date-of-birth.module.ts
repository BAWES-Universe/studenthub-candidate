import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateOfBirthPageRoutingModule } from './date-of-birth-routing.module';

import { DateOfBirthPage } from './date-of-birth.page';
import { TranslateModule } from '@ngx-translate/core';
import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DateDropdownModule,
    TranslateModule.forChild(),
    DateOfBirthPageRoutingModule
  ],
  declarations: [DateOfBirthPage]
})
export class DateOfBirthPageModule {}
