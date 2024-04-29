import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RequestListingComponent} from './request-listing.component';
import {PipesModule} from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    RequestListingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule.forChild()
  ],
  exports: [
    RequestListingComponent
  ]
})
export class RequestListingModule {
}

