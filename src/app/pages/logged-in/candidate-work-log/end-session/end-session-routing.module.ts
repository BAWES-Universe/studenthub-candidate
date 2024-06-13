import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EndSessionPage } from './end-session.page';

const routes: Routes = [
  {
    path: '',
    component: EndSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndSessionPageRoutingModule {}
