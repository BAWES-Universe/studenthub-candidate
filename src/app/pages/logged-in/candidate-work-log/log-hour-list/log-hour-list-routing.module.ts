import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogHourListPage } from './log-hour-list.page';

const routes: Routes = [
  {
    path: '',
    component: LogHourListPage
  },
  {
    path: ':date',
    component: LogHourListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogHourListPageRoutingModule {}
