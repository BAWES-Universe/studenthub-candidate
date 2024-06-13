import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackWorkPage } from './track-work.page';

const routes: Routes = [
  {
    path: '',
    component: TrackWorkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackWorkPageRoutingModule {}
