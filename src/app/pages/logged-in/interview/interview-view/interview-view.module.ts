import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewViewPageRoutingModule } from './interview-view-routing.module';

import { InterviewViewPage } from './interview-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewViewPageRoutingModule
  ],
  declarations: [InterviewViewPage]
})
export class InterviewViewPageModule {}
