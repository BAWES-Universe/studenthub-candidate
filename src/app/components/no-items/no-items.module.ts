import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NoItemsComponent } from './no-items.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NoItemsComponent],
  imports: [
    IonicModule,
    TranslateModule.forChild()
  ],
  exports: [NoItemsComponent]
})
export class NoItemsModule { }