import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferInitComponent} from "./transfer-init.component"
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TransferInitComponent
  ],
  imports: [
    TranslateModule.forChild(),
    CommonModule
  ],
  exports : [
    TransferInitComponent
  ]
})
export class TransferInitModule { }
