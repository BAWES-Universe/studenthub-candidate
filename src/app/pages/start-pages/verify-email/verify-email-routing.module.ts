import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyEmailPage } from './verify-email.page';

const routes: Routes = [
  {
    path: ':email',
    component: VerifyEmailPage
  },
  {
    path: ':email/:code',
    component: VerifyEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyEmailPageRoutingModule {}
