import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdCardPage } from './id-card.page';

const routes: Routes = [
  {
    path: '',
    component: IdCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdCardPageRoutingModule {}
