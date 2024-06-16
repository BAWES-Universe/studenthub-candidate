import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogTimeManuallyPageRoutingModule } from './log-time-manually-routing.module';

import { LogTimeManuallyPage } from './log-time-manually.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    //LogTimeManuallyPageRoutingModule
  ],
  declarations: [LogTimeManuallyPage]
})
export class LogTimeManuallyPageModule {}
