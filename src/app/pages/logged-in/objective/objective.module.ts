import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjectivePageRoutingModule } from './objective-routing.module';

import { ObjectivePage } from './objective.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ObjectivePageRoutingModule
  ],
  declarations: [ObjectivePage]
})
export class ObjectivePageModule {}
