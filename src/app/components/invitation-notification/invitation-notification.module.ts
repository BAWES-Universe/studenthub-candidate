import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationNotificationComponent } from './invitation-notification.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    InvitationNotificationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports: [
    InvitationNotificationComponent
  ]
})
export class InvitationNotificationModule { }
