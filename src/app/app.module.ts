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

/**
 * Modules
 */
import { EnvironmentsModule } from './environments/environments.module';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
import { ChangePassword } from '../pages/logged-in/account/change-password/change-password'; 
import { SalaryPage } from '../pages/logged-in/account/salary/salary'; 

// Pages when logged in
import { PopoverContentPage } from '../pages/logged-in/account/popover/popover';

// Providers / Services
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AccountService } from '../providers/logged-in/account.service';
import { StatisticService } from '../providers/logged-in/statistic.service';

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
    PopoverContentPage,
    SalaryPage,
    ChangePassword
  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    PopoverContentPage,
    SalaryPage,
    ChangePassword
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    // Custom Modules
    EnvironmentsModule
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
    AuthHttpService,
    StatisticService
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }
