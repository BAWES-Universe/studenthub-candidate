import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateEmailPageRoutingModule } from './update-email-routing.module';

import { UpdateEmailPage } from './update-email.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    UpdateEmailPageRoutingModule
  ],
  declarations: [UpdateEmailPage]
})
export class UpdateEmailPageModule {}
