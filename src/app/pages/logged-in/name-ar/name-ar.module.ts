import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NameArPageRoutingModule } from './name-ar-routing.module';

import { NameArPage } from './name-ar.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    NameArPageRoutingModule
  ],
  declarations: [NameArPage]
})
export class NameArPageModule {}
