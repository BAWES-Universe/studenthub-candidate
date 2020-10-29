import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstImpressionPage } from './first-impression.page';

const routes: Routes = [
  {
    path: '',
    component: FirstImpressionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstImpressionPageRoutingModule {}
