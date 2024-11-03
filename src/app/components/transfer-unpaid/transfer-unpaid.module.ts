import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TransferUnpaidComponent } from './transfer-unpaid.component';



@NgModule({
  declarations: [
    TransferUnpaidComponent
  ],
  imports: [
    TranslateModule.forChild(),
    CommonModule
  ],
  exports : [
    TransferUnpaidComponent
  ]
})
export class TransferUnpaidModule { }
