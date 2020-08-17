import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateBankPageRoutingModule } from './update-bank-routing.module';

import { UpdateBankPage } from './update-bank.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    UpdateBankPageRoutingModule
  ],
  declarations: [UpdateBankPage]
})
export class UpdateBankPageModule {}
