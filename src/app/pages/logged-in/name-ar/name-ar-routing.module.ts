import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NameArPage } from './name-ar.page';

const routes: Routes = [
  {
    path: '',
    component: NameArPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NameArPageRoutingModule {}
