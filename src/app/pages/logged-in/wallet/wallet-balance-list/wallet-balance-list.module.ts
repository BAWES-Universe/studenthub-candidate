import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { WalletBalanceListPageRoutingModule } from './wallet-balance-list-routing.module';

import { WalletBalanceListPage } from './wallet-balance-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    PipesModule,
    WalletBalanceListPageRoutingModule
  ],
  declarations: [
    WalletBalanceListPage
  ]
})
export class WalletBalanceListPageModule {}
