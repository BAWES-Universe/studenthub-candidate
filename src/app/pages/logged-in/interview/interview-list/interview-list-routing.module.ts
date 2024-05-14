import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewListPage } from './interview-list.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewListPageRoutingModule {}
