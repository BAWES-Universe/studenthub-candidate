import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkHistoryPage } from './work-history.page';

const routes: Routes = [
  {
    path: '',
    component: WorkHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkHistoryPageRoutingModule {}
