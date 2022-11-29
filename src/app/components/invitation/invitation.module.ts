import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { InvitationComponent } from './invitation.component';
import {PipesModule} from '../../pipes/pipes.module';


@NgModule({
  declarations: [InvitationComponent],
  imports: [
      CommonModule,
      IonicModule,
      RouterModule,
      PipesModule,
      TranslateModule.forChild(),
  ],
  exports: [InvitationComponent]
})
export class InvitationModule { }
