import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjectivePage } from './objective.page';

const routes: Routes = [
  {
    path: '',
    component: ObjectivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjectivePageRoutingModule {}
