import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EducationFormPage } from './education-form.page';

const routes: Routes = [
  {
    path: '',
    component: EducationFormPage
  },
  {
    path: 'major',
    loadChildren: () => import('./major/major.module').then( m => m.MajorPageModule)
  },
  {
    path: 'degree',
    loadChildren: () => import('./degree/degree.module').then( m => m.DegreePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EducationFormPageRoutingModule {}
