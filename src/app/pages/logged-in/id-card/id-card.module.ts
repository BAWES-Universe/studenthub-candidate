import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdCardPageRoutingModule } from './id-card-routing.module';

import { IdCardPage } from './id-card.page';
import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DateDropdownModule,
    TranslateModule.forChild(),
    IdCardPageRoutingModule
  ],
  declarations: [IdCardPage]
})
export class IdCardPageModule {}
