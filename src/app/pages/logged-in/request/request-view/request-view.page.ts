import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { Request } from 'src/app/models/request';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
//service
import { RequestService } from 'src/app/providers/logged-in/request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.page.html',
  styleUrls: ['./request-view.page.scss'],
})
export class RequestViewPage implements OnInit {

  public request_uuid: string;
   
  public request: Request;

  public loading: boolean = false; 

  public applying: boolean = false; 
  
  constructor(
    public alertCtrl: AlertController,

    public modalCtrl: ModalController,
    public eventService: EventService,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public requestService: RequestService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
   // this.request_uuid = this.activatedRoute.snapshot.paramMap.get('request_uuid');
  }

  ionViewDidEnter() {
    if (!this.request)
      this.loadDetails();
  }

  loadDetails() {
    this.loading = true; 

    this.requestService.view(this.request_uuid).subscribe(data => {
      this.loading = false; 
    
      this.request = data;
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  apply() {
    this.applying = true; 

    this.requestService.apply(this.request_uuid).subscribe(res => {
      if(res.operation == "success") {
        this.request.candidateApplication = res.candidateApplication;
        this.dismiss();
      } else {
        this.alertCtrl.create({
          message: this.authService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    }, () => {      
    }, () => {
      this.applying = false;
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
