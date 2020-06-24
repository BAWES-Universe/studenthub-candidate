import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/providers/logged-in/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public oldPassword: string = '';
  public newPassword: string = '';

  public passwordForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder,
    public accountService: AccountService,
    private _alertCtrl: AlertController
  ) {
  }

  ngOnInit() {
    // Initialize the Login Form
    this.passwordForm = this._fb.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required]
    });
  }


  /**
   * Attempts to login with the provided email and password
   */
  async save() {

    const oldP = this.passwordForm.value.oldPassword;
    const newP = this.passwordForm.value.newPassword;

    if (!this.passwordForm.valid) {
      return false;
    }

    this.isLoading = true;

    this.accountService.changePassword(oldP, newP).subscribe(async res => {

      this.isLoading = false;
      
      if (res.operation == "success") {
        
        let alert = await this._alertCtrl.create({
          header: 'Success',
          message: res.message,
          buttons: ['Ok'],
        });
        alert.present();

        this.passwordForm.reset();

        this.navCtrl.navigateRoot(['/'], { 
          animated: true,
          animationDirection: 'forward',
        });

      } else if (res.operation == "error") {

        let alert = await this._alertCtrl.create({
          header: 'Error',
          message: res.message,
          buttons: ['Ok'],
        });
        alert.present();
      }
    }, () => {
      this.isLoading = false;
    });
  } 
}
