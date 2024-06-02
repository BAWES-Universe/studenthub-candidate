import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MajorPage } from './major.page';

const routes: Routes = [
  {
    path: '',
    component: MajorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MajorPageRoutingModule {}
