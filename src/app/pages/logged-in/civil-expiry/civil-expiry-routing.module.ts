import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CivilExpiryPage } from './civil-expiry.page';

const routes: Routes = [
  {
    path: '',
    component: CivilExpiryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CivilExpiryPageRoutingModule {}
