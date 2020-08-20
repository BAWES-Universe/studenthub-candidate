import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CivilIdBackPage } from './civil-id-back.page';

const routes: Routes = [
  {
    path: '',
    component: CivilIdBackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CivilIdBackPageRoutingModule {}
