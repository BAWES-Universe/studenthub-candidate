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
import { SalaryPage } from '../pages/logged-in/account/salary/salary'; 

// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { HomePage } from '../pages/logged-in/home/home';

// Providers / Services
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AccountService } from '../providers/logged-in/account.service';

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
    SalaryPage
  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
    SalaryPage
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
    AccountService,
    AuthHttpService
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }
