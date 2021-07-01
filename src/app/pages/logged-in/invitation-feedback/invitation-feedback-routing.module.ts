import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitationFeedbackPage } from './invitation-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: InvitationFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationFeedbackPageRoutingModule {}
