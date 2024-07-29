import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountsPage } from './discounts.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountsPage
  },
  {
    path: 'discount-detail',
    loadChildren: () => import('./discount-detail/discount-detail.module').then( m => m.DiscountDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountsPageRoutingModule {}
