import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdCardPageRoutingModule } from './id-card-routing.module';

import { IdCardPage } from './id-card.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    IdCardPageRoutingModule
  ],
  declarations: [IdCardPage]
})
export class IdCardPageModule {}
