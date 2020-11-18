import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { AgePipe } from 'src/app/pipes/age.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    ProfilePageRoutingModule
  ],
  declarations: [
    ProfilePage,
    AgePipe
  ]
})
export class ProfilePageModule {}
