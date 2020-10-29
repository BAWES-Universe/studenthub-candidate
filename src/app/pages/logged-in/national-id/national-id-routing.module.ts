import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NationalIdPage } from './national-id.page';

const routes: Routes = [
  {
    path: '',
    component: NationalIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NationalIdPageRoutingModule {}
