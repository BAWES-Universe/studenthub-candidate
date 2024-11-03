import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AssignedComponent } from './assigned.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AssignedComponent
  ],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ],
  exports : [
    AssignedComponent
  ]
})
export class AssignedModule { }
