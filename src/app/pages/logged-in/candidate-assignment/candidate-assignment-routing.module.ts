import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateAssignmentPage } from './candidate-assignment.page';

const routes: Routes = [
  {
    path: ':id',
    component: CandidateAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateAssignmentPageRoutingModule {}
