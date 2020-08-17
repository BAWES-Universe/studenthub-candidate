import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateBankPage } from './update-bank.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateBankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateBankPageRoutingModule {}
