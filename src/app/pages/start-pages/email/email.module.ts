import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { EmailPageRoutingModule } from './email-routing.module';
import { EmailPage } from './email.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    EmailPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [EmailPage]
})
export class EmailPageModule { }
