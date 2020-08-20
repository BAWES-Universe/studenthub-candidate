import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CivilIdFrontPage } from './civil-id-front.page';

const routes: Routes = [
  {
    path: '',
    component: CivilIdFrontPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CivilIdFrontPageRoutingModule {}
