import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PhotoActionComponent } from './photo-action';

@NgModule({
  declarations: [PhotoActionComponent],
  entryComponents:[
    PhotoActionComponent
  ],
  imports: [
    TranslateModule.forChild(),
    IonicModule
  ],
  exports: [PhotoActionComponent]
})
export class PhotoActionModule { }
