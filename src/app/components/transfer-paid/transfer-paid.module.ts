import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TransferPaidComponent } from './transfer-paid.component';



@NgModule({
  declarations: [
    TransferPaidComponent
  ],
  imports: [
    TranslateModule.forChild(),
    CommonModule
  ],
  exports : [
    TransferPaidComponent
  ]
})
export class TransferPaidModule { }
