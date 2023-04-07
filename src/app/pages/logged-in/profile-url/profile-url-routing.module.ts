import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileUrlPage } from './profile-url.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileUrlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileUrlRoutingModule {}
