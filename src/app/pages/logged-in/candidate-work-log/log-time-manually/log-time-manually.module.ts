import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogTimeManuallyPageRoutingModule } from './log-time-manually-routing.module';

import { LogTimeManuallyPage } from './log-time-manually.page';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    //LogTimeManuallyPageRoutingModule
  ],
  declarations: [LogTimeManuallyPage, TimePickerComponent]
})
export class LogTimeManuallyPageModule {}
