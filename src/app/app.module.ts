import {NgModule, APP_INITIALIZER, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { UpdateAlertModule } from './components/update-alert/update-alert.module';

import { AuthService } from './providers/auth.service';
import { OptionPageModule } from './pages/logged-in/option/option.module';
import {SentryErrorhandlerService} from './providers/sentry.errorhandler.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


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
    IonicStorageModule.forRoot({
      name: '__payroll_candidate'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    UpdateAlertModule,
    OptionPageModule
  ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService],
      multi: true
    },
    SwUpdate,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorhandlerService }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
