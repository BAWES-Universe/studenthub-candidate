import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DegreePage } from './degree.page';

const routes: Routes = [
  {
    path: '',
    component: DegreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DegreePageRoutingModule {}
