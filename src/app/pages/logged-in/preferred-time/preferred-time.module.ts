import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferredTimePageRoutingModule } from './preferred-time-routing.module';

import { PreferredTimePage } from './preferred-time.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    PreferredTimePageRoutingModule
  ],
  declarations: [PreferredTimePage]
})
export class PreferredTimePageModule {}
