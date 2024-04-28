import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Request } from 'src/app/models/request';
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

  constructor(
    public modalCtrl: ModalController,
    public eventService: EventService,
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

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
