import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EducationFormPageRoutingModule } from './education-form-routing.module';

import { EducationFormPage } from './education-form.page';
import { TranslateModule } from '@ngx-translate/core';
import { MajorPageModule } from './major/major.module';
import { DegreePageModule } from './degree/degree.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EducationFormPageRoutingModule,
    ReactiveFormsModule,
    MajorPageModule,
    DegreePageModule,
    TranslateModule.forChild()
  ],
  declarations: [EducationFormPage]
})
export class EducationFormPageModule {}
