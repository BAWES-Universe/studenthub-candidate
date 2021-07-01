import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitationFeedbackPageRoutingModule } from './invitation-feedback-routing.module';

import { InvitationFeedbackPage } from './invitation-feedback.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    InvitationFeedbackPageRoutingModule
  ],
  declarations: [InvitationFeedbackPage]
})
export class InvitationFeedbackPageModule {}
