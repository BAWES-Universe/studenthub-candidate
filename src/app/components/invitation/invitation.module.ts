import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { InvitationComponent } from './invitation.component';


@NgModule({
  declarations: [InvitationComponent],
  imports: [ 
      CommonModule,
      IonicModule,
      RouterModule,
      TranslateModule.forChild(),
  ],
  exports: [InvitationComponent]
})
export class InvitationModule { }
