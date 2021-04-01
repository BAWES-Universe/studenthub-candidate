import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitationDetailPage } from './invitation-detail.page';

const routes: Routes = [
  {
    path: ':invitation_uuid',
    component: InvitationDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationDetailPageRoutingModule {}
