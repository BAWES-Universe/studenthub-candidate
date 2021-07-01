import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';
import { AuthService } from './providers/auth.service';
import { LoginGuard } from './providers/guards/login-guard.service';
import { CompleteProfileGuard } from './providers/guards/complete-profile-guard.service';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/logged-in/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthService, CompleteProfileGuard]
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
    canActivate: [AuthService],
    data: {
      name: 'ChangePasswordPage'
    }
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/start-pages/landing/landing.module').then( m => m.LandingPageModule),
    canActivate: [LoginGuard],
    data: {
      name: 'LandingPage'
    }
  },
  {
    path: 'email',
    loadChildren: () => import('./pages/start-pages/email/email.module').then( m => m.EmailPageModule),
    canActivate: [LoginGuard],
    data: {
      name: 'EmailPage'
    }
  },
  {
    path: 'password',
    loadChildren: () => import('./pages/start-pages/password/password.module').then( m => m.PasswordPageModule),
    canActivate: [LoginGuard],
    data: {
      name: 'PasswordPage'
    }
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/start-pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate: [LoginGuard],
    data: {
      name: 'RegisterPage'
    }
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/start-pages/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule),
    data: {
      name: 'VerifyEmailPage'
    }
  },
  {
    path: 'complete-profile',
    loadChildren: () => import('./pages/logged-in/complete-profile/complete-profile.module').then( m => m.CompleteProfilePageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompleteProfilePage'
    }
  },
  {
    path: 'date-of-birth',
    loadChildren: () => import('./pages/logged-in/date-of-birth/date-of-birth.module').then( m => m.DateOfBirthPageModule),
    canActivate: [AuthService],
    data: {
      name: 'DateOfBirthPage'
    }
  },
  {
    path: 'upload-cv',
    loadChildren: () => import('./pages/logged-in/upload-cv/upload-cv.module').then( m => m.UploadCvPageModule),
    canActivate: [AuthService],
    data: {
      name: 'UploadCvPage'
    }
  },
  {
    path: 'university',
    loadChildren: () => import('./pages/logged-in/university/university.module').then( m => m.UniversityPageModule),
    canActivate: [AuthService],
    data: {
      name: 'UniversityPage'
    }
  },
  {
    path: 'gender',
    loadChildren: () => import('./pages/logged-in/gender/gender.module').then( m => m.GenderPageModule),
    canActivate: [AuthService],
    data: {
      name: 'GenderPage'
    }
  },
  {
    path: 'driving-license',
    loadChildren: () => import('./pages/logged-in/driving-license/driving-license.module').then( m => m.DrivingLicensePageModule),
    canActivate: [AuthService],
    data: {
      name: 'DrivingLicensePage'
    }
  },
  {
    path: 'nationality',
    loadChildren: () => import('./pages/logged-in/nationality/nationality.module').then( m => m.NationalityPageModule),
    canActivate: [AuthService],
    data: {
      name: 'NationalityPage'
    }
  },
  {
    path: 'name',
    loadChildren: () => import('./pages/logged-in/name/name.module').then( m => m.NamePageModule),
    canActivate: [AuthService],
    data: {
      name: 'NamePage'
    }
  },
  {
    path: 'name-ar',
    loadChildren: () => import('./pages/logged-in/name-ar/name-ar.module').then( m => m.NameArPageModule),
    canActivate: [AuthService],
    data: {
      name: 'NameArPage'
    }
  },
  {
    path: 'phone',
    loadChildren: () => import('./pages/logged-in/phone/phone.module').then( m => m.PhonePageModule),
    canActivate: [AuthService],
    data: {
      name: 'PhonePage'
    }
  },
  {
    path: 'profile-photo',
    loadChildren: () => import('./pages/logged-in/profile-photo/profile-photo.module').then( m => m.ProfilePhotoPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ProfilePhotoPage'
    }
  },
  {
    path: 'objective',
    loadChildren: () => import('./pages/logged-in/objective/objective.module').then( m => m.ObjectivePageModule),
    canActivate: [AuthService],
    data: {
      name: 'ObjectivePage'
    }
  },
  {
    path: 'skill-form',
    loadChildren: () => import('./pages/logged-in/skill-form/skill-form.module').then( m => m.SkillFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'SkillFormPage'
    }
  },
  {
    path: 'experience-form',
    loadChildren: () => import('./pages/logged-in/experience-form/experience-form.module').then( m => m.ExperienceFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ExperienceFormPage'
    }
  },
  {
    path: 'id-card',
    loadChildren: () => import('./pages/logged-in/id-card/id-card.module').then( m => m.IdCardPageModule),
    canActivate: [AuthService],
    data: {
      name: 'IdCardPage'
    }
  },
  {
    path: 'update-email',
    loadChildren: () => import('./pages/logged-in/update-email/update-email.module').then( m => m.UpdateEmailPageModule),
    data: {
      name: 'UpdateEmailPage'
    }
  },
  {
    path: 'update-password',
    loadChildren: () => import('./pages/start-pages/update-password/update-password.module').then( m => m.UpdatePasswordPageModule),
    data: {
      name: 'UpdatePasswordPage'
    }
  },
  {
    path: 'location',
    loadChildren: () => import('./pages/logged-in/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/logged-in/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'national-id',
    loadChildren: () => import('./pages/logged-in/national-id/national-id.module').then( m => m.NationalIdPageModule)
  },
  {
    path: 'first-impression',
    loadChildren: () => import('./pages/logged-in/first-impression/first-impression.module').then( m => m.FirstImpressionPageModule)
  },
  {
    path: 'personal-info',
    loadChildren: () => import('./pages/logged-in/personal-info/personal-info.module').then( m => m.PersonalInfoPageModule)
  },
  {
    path: 'invitation-detail',
    loadChildren: () => import('./pages/logged-in/invitation-detail/invitation-detail.module').then( m => m.InvitationDetailPageModule),
    data: {
      name: 'InvitationDetailPage'
    }
  },
  {
    path: 'app-error',
    loadChildren: () => import('./pages/errors/app-error/app-error.module').then( m => m.AppErrorPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      preloadingStrategy: SelectiveLoadingStrategy// PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
