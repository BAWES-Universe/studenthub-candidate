import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatListPageRoutingModule } from './chat-list-routing.module';

import { ChatListPage } from './chat-list.page';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule} from "../../../../pipes/pipes.module";

import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LoadingModalModule,
    TranslateModule.forChild(),
    ChatListPageRoutingModule
  ],
  declarations: [ChatListPage]
})
export class ChatListPageModule {}
