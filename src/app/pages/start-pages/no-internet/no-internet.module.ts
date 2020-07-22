import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { NoInternetPage } from './no-internet.page';

const routes: Routes = [
  {
    path: '',
    component: NoInternetPage
  }
];

@NgModule({
  imports: [
    CommonModule, 
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [NoInternetPage]
})
export class NoInternetPageModule {}
