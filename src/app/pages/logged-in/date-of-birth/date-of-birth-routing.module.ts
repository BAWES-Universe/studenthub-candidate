import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DateOfBirthPage } from './date-of-birth.page';

const routes: Routes = [
  {
    path: '',
    component: DateOfBirthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DateOfBirthPageRoutingModule {}
