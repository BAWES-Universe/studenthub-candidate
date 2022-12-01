import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletBalanceListPage } from './wallet-balance-list.page';

const routes: Routes = [
  {
    path: '',
    component: WalletBalanceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletBalanceListPageRoutingModule {}
