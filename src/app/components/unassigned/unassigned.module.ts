import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnassignedComponent } from './unassigned.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    UnassignedComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  exports: [
    UnassignedComponent
  ]
})
export class UnassignedModule { }
