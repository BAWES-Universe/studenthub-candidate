import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CivilExpiryPageRoutingModule } from './civil-expiry-routing.module';

import { CivilExpiryPage } from './civil-expiry.page';
import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DateDropdownModule,
    TranslateModule.forChild(),
    CivilExpiryPageRoutingModule
  ],
  declarations: [CivilExpiryPage]
})
export class CivilExpiryPageModule {}
