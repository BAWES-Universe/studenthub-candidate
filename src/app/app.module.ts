import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UpdateAlertModule } from './components/update-alert/update-alert.module';
// import { CookieService } from 'ngx-cookie-service';
import { CacheModule } from 'ionic-cache';

import { AuthService } from './providers/auth.service';
import { OptionPageModule } from './pages/logged-in/option/option.module';
import { SentryErrorhandlerService } from './providers/sentry.errorhandler.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NameArPageModule } from './pages/logged-in/name-ar/name-ar.module';
import { NamePageModule } from './pages/logged-in/name/name.module';
import { EmailPageModule } from './pages/start-pages/email/email.module';
import { PhonePageModule } from './pages/logged-in/phone/phone.module';
import { ProfilePhotoPageModule } from './pages/logged-in/profile-photo/profile-photo.module';
import { ObjectivePageModule } from './pages/logged-in/objective/objective.module';
import { SkillFormPageModule } from './pages/logged-in/skill-form/skill-form.module';
import { ExperienceFormPageModule } from './pages/logged-in/experience-form/experience-form.module';
import { IdCardPageModule } from './pages/logged-in/id-card/id-card.module';
import { UniversityPageModule } from './pages/logged-in/university/university.module';
import { NationalityPageModule } from './pages/logged-in/nationality/nationality.module';
import { DateOfBirthPageModule } from './pages/logged-in/date-of-birth/date-of-birth.module';
import { GenderPageModule } from './pages/logged-in/gender/gender.module';
import { DrivingLicensePageModule } from './pages/logged-in/driving-license/driving-license.module';
import { UploadCvPageModule } from './pages/logged-in/upload-cv/upload-cv.module';
import { PhotoActionModule } from './components/photo-action/photo-action.module';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { UpdateEmailPageModule } from './pages/logged-in/update-email/update-email.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import {UpdateBankPageModule} from "./pages/logged-in/update-bank/update-bank.module";
import { CompanyPageModule } from './pages/logged-in/company/company.module';
import { CivilIdFrontPageModule } from './pages/logged-in/civil-id-front/civil-id-front.module';
import { CivilIdBackPageModule } from './pages/logged-in/civil-id-back/civil-id-back.module';
import { CivilExpiryPageModule } from './pages/logged-in/civil-expiry/civil-expiry.module';

export function startupServiceFactory(authService) {
  return () => authService.load();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    /*IonicStorageModule.forRoot({
      name: '__payroll_candidate'
    }),*/
    CacheModule.forRoot({ keyPrefix: '__payroll_candidate_cache' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    UpdateAlertModule,
    OptionPageModule,
    NamePageModule,
    NameArPageModule,
    EmailPageModule,
    PhonePageModule,
    ProfilePhotoPageModule,
    ObjectivePageModule,
    SkillFormPageModule,
    ExperienceFormPageModule,
    IdCardPageModule,
    UniversityPageModule,
    NationalityPageModule,
    DateOfBirthPageModule,
    GenderPageModule,
    DrivingLicensePageModule,
    UploadCvPageModule,
    PhotoActionModule,
    UpdateEmailPageModule,
    UpdateBankPageModule,
    CompanyPageModule,
    CivilIdFrontPageModule,
    CivilIdBackPageModule,
    CivilExpiryPageModule,
  ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService],
      multi: true
    },
    File,
    FileChooser,
    FilePath,
    IOSFilePicker,
    OneSignal,
    SwUpdate,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorhandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
