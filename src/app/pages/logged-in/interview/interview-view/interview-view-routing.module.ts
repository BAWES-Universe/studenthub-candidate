import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewViewPage } from './interview-view.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewViewPageRoutingModule {}
