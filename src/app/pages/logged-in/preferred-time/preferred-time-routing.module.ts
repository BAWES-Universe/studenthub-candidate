import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferredTimePage } from './preferred-time.page';

const routes: Routes = [
  {
    path: '',
    component: PreferredTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferredTimePageRoutingModule {}
