import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
 
import { UpdateAlertComponent } from './update-alert.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [UpdateAlertComponent],
    imports: [ 
        IonicModule,
        TranslateModule.forChild()
    ],
    exports: [UpdateAlertComponent]
})
export class UpdateAlertModule { }