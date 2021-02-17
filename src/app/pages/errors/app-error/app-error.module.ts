import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { AppErrorPageRoutingModule } from './app-error-routing.module';

import { AppErrorPage } from './app-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    AppErrorPageRoutingModule
  ],
  declarations: [AppErrorPage]
})
export class AppErrorPageModule {}
