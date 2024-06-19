import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackWorkPageRoutingModule } from './track-work-routing.module';

import { TrackWorkPage } from './track-work.page';
import { LogTimeManuallyPageModule } from '../log-time-manually/log-time-manually.module';
import { EndSessionPageModule } from '../end-session/end-session.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    TranslateModule.forChild(),
    LogTimeManuallyPageModule,
    TrackWorkPageRoutingModule,
    EndSessionPageModule,
  ],
  declarations: [TrackWorkPage]
})
export class TrackWorkPageModule {}
