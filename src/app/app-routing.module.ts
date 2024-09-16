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
    path: 'introduction',
    loadChildren: () => import('./pages/logged-in/introduction/introduction.module').then( m => m.IntroductionPageModule),
    canActivate: [AuthService],
    data: {
      name: 'IntroductionPage'
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
    loadChildren: () => import('./pages/logged-in/location/location.module').then( m => m.LocationPageModule),
    canActivate: [AuthService],
    data: {
      name: 'LocationPage'
    }
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/logged-in/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthService],
    data: {
      name: 'ProfilePage'
    }
  },
  {
    path: 'national-id',
    loadChildren: () => import('./pages/logged-in/national-id/national-id.module').then( m => m.NationalIdPageModule),
    canActivate: [AuthService],
    data: {
      name: 'NationalIdPage'
    }
  },
  {
    path: 'first-impression',
    loadChildren: () => import('./pages/logged-in/first-impression/first-impression.module').then( m => m.FirstImpressionPageModule),
    canActivate: [AuthService],
    data: {
      name: 'FirstImpressionPage'
    }
  },
  {
    path: 'personal-info',
    loadChildren: () => import('./pages/logged-in/personal-info/personal-info.module').then( m => m.PersonalInfoPageModule),
    canActivate: [AuthService],
    data: {
      name: 'PersonalInfoPage'
    }
  },
  {
    path: 'invitation-detail',
    loadChildren: () => import('./pages/logged-in/invitation-detail/invitation-detail.module').then( m => m.InvitationDetailPageModule),
    canActivate: [AuthService],
    data: {
      name: 'InvitationDetailPage'
    }
  },
  {
    path: 'log-date-list',
    loadChildren: () => import('./pages/logged-in/candidate-work-log/log-date-list/log-date-list.module').then( m => m.LogDateListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'LogDateListPage'
    }
  },
  {
    path: 'log-hour-list',
    loadChildren: () => import('./pages/logged-in/candidate-work-log/log-hour-list/log-hour-list.module').then( m => m.LogHourListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'LogHourListPage'
    }
  },
  {
    path: 'wallet-balance',
    loadChildren: () => import('./pages/logged-in/wallet/wallet-balance-list/wallet-balance-list.module').then( m => m.WalletBalanceListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'WalletBalanceListPage'
    }
  },
  {
    path: 'preferred-time',
    loadChildren: () => import('./pages/logged-in/preferred-time/preferred-time.module').then( m => m.PreferredTimePageModule),
    canActivate: [AuthService],
    data: {
      name: 'PreferredTimePage'
    }
  },
  {
    path: 'app-error',
    loadChildren: () => import('./pages/errors/app-error/app-error.module').then( m => m.AppErrorPageModule),
    data: {
      name: 'AppPage'
    }
  },
  {
    path: 'request-list',
    loadChildren: () => import('./pages/logged-in/request/request-list/request-list.module').then( m => m.RequestListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'RequestListPage'
    }
  },
  {
    path: 'request-view',
    loadChildren: () => import('./pages/logged-in/request/request-view/request-view.module').then( m => m.RequestViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'RequestViewPage'
    }
  },
  {
    path: 'interview-list',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/interview/interview-list/interview-list.module').then( m => m.InterviewListPageModule)
  },
  {
    path: 'interview-view',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/interview/interview-view/interview-view.module').then( m => m.InterviewViewPageModule)
  },
  {
    path: 'support',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/support/ticket-list/ticket-list.module').then( m => m.TicketListPageModule)
  },
  {
    path: 'ticket-view',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/support/ticket-view/ticket-view.module').then( m => m.TicketViewPageModule)
  },
  {
    path: 'ticket-form',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/support/ticket-form/ticket-form.module').then( m => m.TicketFormPageModule)
  },
  {
    path: 'education-form',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/education-form/education-form.module').then( m => m.EducationFormPageModule)
  },
  
  {
    path: 'track-work',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/candidate-work-log/track-work/track-work.module').then( m => m.TrackWorkPageModule)
  },
  {
    path: 'log-time-manually',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/candidate-work-log/log-time-manually/log-time-manually.module').then( m => m.LogTimeManuallyPageModule)
  },
  {
    path: 'end-session',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/candidate-work-log/end-session/end-session.module').then( m => m.EndSessionPageModule)
  },
  {
    path: 'discounts',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/discounts/discounts.module').then( m => m.DiscountsPageModule)
  },
  {
    path: 'chat-list',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/chat/chat-list/chat-list.module').then( m => m.ChatListPageModule)
  },
  {
    path: 'chat-view',
    canActivate: [AuthService],
    loadChildren: () => import('./pages/logged-in/chat/chat-view/chat-view.module').then( m => m.ChatViewPageModule)
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
