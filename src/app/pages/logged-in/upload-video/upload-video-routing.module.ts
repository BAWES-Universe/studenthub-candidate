import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadVideoPage } from './upload-video.page';

const routes: Routes = [
  {
    path: '',
    component: UploadVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadVideoPageRoutingModule {}
