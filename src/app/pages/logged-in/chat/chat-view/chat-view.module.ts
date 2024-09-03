import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatViewPageRoutingModule } from './chat-view-routing.module';

import { ChatViewPage } from './chat-view.page';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    //NoItemsModule,
    PipesModule,
    ChatViewPageRoutingModule
  ],
  providers: [DatePipe],
  declarations: [ChatViewPage]
})
export class ChatViewPageModule {}
