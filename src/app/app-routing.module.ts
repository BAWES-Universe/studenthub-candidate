import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './providers/auth.service';

/**
 * 
    redirectTo: 'view',
    pathMatch: 'full'
  },
  {
    path: 'view',
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/logged-in/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'no-internet',
    loadChildren: () => import('./pages/start-pages/no-internet/no-internet.module').then(m => m.NoInternetPageModule),
    data: {
      name: 'NoInternetPage',
    }
  },
  {
    path: 'server-error',
    loadChildren: () => import('./pages/errors/server-error/server-error.module').then(m => m.ServerErrorPageModule),
    data: {
      name: 'ServerErrorPage',
    }
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/errors/not-found/not-found.module').then(m => m.NotFoundPageModule),
    data: {
      name: 'NotFoundPage',
    }
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/logged-in/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/start-pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/start-pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'email',
    loadChildren: () => import('./pages/start-pages/email/email.module').then( m => m.EmailPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./pages/start-pages/password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/start-pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/start-pages/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  },
  {
    path: 'complete-profile',
    loadChildren: () => import('./pages/logged-in/complete-profile/complete-profile.module').then( m => m.CompleteProfilePageModule),
    canActivate: [AuthService],
  },
  {
    path: 'date-of-birth',
    loadChildren: () => import('./pages/logged-in/date-of-birth/date-of-birth.module').then( m => m.DateOfBirthPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'upload-cv',
    loadChildren: () => import('./pages/logged-in/upload-cv/upload-cv.module').then( m => m.UploadCvPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'university',
    loadChildren: () => import('./pages/logged-in/university/university.module').then( m => m.UniversityPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'gender',
    loadChildren: () => import('./pages/logged-in/gender/gender.module').then( m => m.GenderPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'driving-license',
    loadChildren: () => import('./pages/logged-in/driving-license/driving-license.module').then( m => m.DrivingLicensePageModule),
    canActivate: [AuthService],
  },
  {
    path: 'nationality',
    loadChildren: () => import('./pages/logged-in/nationality/nationality.module').then( m => m.NationalityPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'name',
    loadChildren: () => import('./pages/logged-in/name/name.module').then( m => m.NamePageModule),
    canActivate: [AuthService],
  },
  {
    path: 'name-ar',
    loadChildren: () => import('./pages/logged-in/name-ar/name-ar.module').then( m => m.NameArPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'phone',
    loadChildren: () => import('./pages/logged-in/phone/phone.module').then( m => m.PhonePageModule),
    canActivate: [AuthService],
  },
  {
    path: 'profile-photo',
    loadChildren: () => import('./pages/logged-in/profile-photo/profile-photo.module').then( m => m.ProfilePhotoPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'objective',
    loadChildren: () => import('./pages/logged-in/objective/objective.module').then( m => m.ObjectivePageModule),
    canActivate: [AuthService],
  },
  {
    path: 'skill-form',
    loadChildren: () => import('./pages/logged-in/skill-form/skill-form.module').then( m => m.SkillFormPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'experience-form',
    loadChildren: () => import('./pages/logged-in/experience-form/experience-form.module').then( m => m.ExperienceFormPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'id-card',
    loadChildren: () => import('./pages/logged-in/id-card/id-card.module').then( m => m.IdCardPageModule),
    canActivate: [AuthService],
  },
  {
    path: 'update-email',
    loadChildren: () => import('./pages/logged-in/update-email/update-email.module').then( m => m.UpdateEmailPageModule)
  },
  {
    path: 'update-password',
    loadChildren: () => import('./pages/start-pages/update-password/update-password.module').then( m => m.UpdatePasswordPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
