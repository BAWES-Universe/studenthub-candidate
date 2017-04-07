import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// App Imports
import { MyApp } from './app.component';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { HomePage } from '../pages/logged-in/home/home';

import { AssignedListPage } from '../pages/assigned/assigned-list/assigned-list';
import { TransferListPage } from '../pages/transfer/transfer-list/transfer-list';

// Providers / Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { AssignedService } from '../providers/logged-in/assigned.service';
import { TransferService } from '../providers/logged-in/transfer.service';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '428d94c2'
  }
};

@NgModule({
  declarations: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
    AssignedListPage,
    TransferListPage

  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
    AssignedListPage,
    TransferListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot()
  ],
  providers: [
    // Ionic Native 
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // Custom
    AuthService, // Handles all Authorization
    ConfigService, // Handles Environment-specific Variables
    AssignedService,
    TransferService,
    AuthHttpService
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }
