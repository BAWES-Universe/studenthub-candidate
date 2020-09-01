import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
//services
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class CompleteProfileGuard implements CanActivate {

  constructor(private authService: AuthService, private navCtrl: NavController) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.authService.isLogin && !this.authService.isProfileCompleted) {
        this.navCtrl.navigateRoot(['complete-profile']);
    }
    
    // navigate to login page
    // this._router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return true;
  }
}
