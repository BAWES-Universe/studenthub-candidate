import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page'; 
import { AuthService } from 'src/app/providers/auth.service';


const routes: Routes = [
  {
    path: 'view',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule),
            canActivate: [AuthService],
            data: {
              preload: true
            }
          },
        ]
      },
      {
        path: 'payments',
        children: [
          {
            path: '',
            loadChildren: () => import('../payments/payments.module').then(m => m.PaymentsPageModule),
            canActivate: [AuthService], 
            data: {
              preload: true
            }
          },
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule),
            canActivate: [AuthService], 
            data: {
              preload: true
            }
          },
        ]
      },
      {
        path: 'invitations',
        children: [
          {
            path: '',
            loadChildren: () => import('../invitation/invitation.module').then(m => m.InvitationPageModule),
            canActivate: [AuthService],
            data: {
              preload: true
            }
          },
        ]
      },
      {
        path: '',
        redirectTo: '/view/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/view/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
