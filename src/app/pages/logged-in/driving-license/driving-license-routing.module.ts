import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DrivingLicensePage } from './driving-license.page';

const routes: Routes = [
  {
    path: '',
    component: DrivingLicensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrivingLicensePageRoutingModule {}
