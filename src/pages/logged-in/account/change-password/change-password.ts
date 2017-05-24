import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController } from 'ionic-angular';

// Providers
import { AccountService } from '../../../../providers/logged-in/account.service';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'change-password',
  templateUrl: 'change-password.html'
})
export class ChangePassword {

  public oldPassword:string = '';
  public newPassword:string = '';

  public passwordForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder,
    public accountService: AccountService,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _viewCtrl: ViewController,
  ) { 
  // Initialize the Login Form
      this.passwordForm = this._fb.group({
        oldPassword: ["", Validators.required],
        newPassword: ["", Validators.required]
      });
  }


  /**
   * Attempts to login with the provided email and password
   */
  save(){
    let loader = this._loadingCtrl.create();
    loader.present();
    const oldP = this.passwordForm.value.oldPassword;
    const newP = this.passwordForm.value.newPassword;
      if (this.passwordForm.valid) {
        this.accountService.changePassword(oldP, newP).subscribe(res => {
          loader.dismiss();
          if (res.operation == "success") {
            let alert = this._alertCtrl.create({
              title: 'Success',
              message: res.message,
              buttons: ['Ok'],
            });
            alert.present();
            this.passwordForm.reset();
          } else if (res.operation == "error") {
            let alert = this._alertCtrl.create({
              title: 'Error',
              message: res.message,
              buttons: ['Ok'],
            });
            alert.present();
          }
        });
      }
  }
}
