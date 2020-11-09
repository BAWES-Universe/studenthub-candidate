import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KuwaitiNationalPage } from './kuwaiti-national.page';

const routes: Routes = [
  {
    path: '',
    component: KuwaitiNationalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KuwaitiNationalPageRoutingModule {}
