import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NoItemsComponent } from './no-items.component';
import { TranslateModule } from '@ngx-translate/core';
//import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NoItemsComponent],
  imports: [
    IonicModule,
    //FormsModule,
    CommonModule,
    TranslateModule.forChild()
  ],
  exports: [NoItemsComponent]
})
export class NoItemsModule { }