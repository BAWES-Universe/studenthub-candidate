import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { HomePage } from '../pages/logged-in/home/home';
import { TransferListPage } from '../pages/transfer/transfer-list/transfer-list';

// Providers / Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AuthHttpService } from '../providers/logged-in/authhttp.service';

import { TransferService } from '../providers/logged-in/transfer.service';


@NgModule({
  declarations: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
 
    TransferListPage

  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
 
    TransferListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
     IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage, // Ionic Storage  
    AuthService, // Handles all Authorization
    ConfigService, // Handles Environment-specific Variables
    
    TransferService,
    AuthHttpService
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
