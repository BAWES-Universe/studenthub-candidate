import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountDetailPage } from './discount-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountDetailPageRoutingModule {}
