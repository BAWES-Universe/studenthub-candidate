import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EndSessionPageRoutingModule } from './end-session-routing.module';

import { EndSessionPage } from './end-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //EndSessionPageRoutingModule
  ],
  declarations: [EndSessionPage]
})
export class EndSessionPageModule {}
