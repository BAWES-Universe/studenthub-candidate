import { Component, Input, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
//services
import { AuthService } from 'src/app/providers/auth.service';
import {EventService} from "../../providers/event.service";
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//models
import { Request } from '../../models/request';
import { Invitation } from "../../models/invitation";


@Component({
  selector: 'request-listing',
  templateUrl: './request-listing.component.html',
  styleUrls: ['./request-listing.component.scss'],
})
export class RequestListingComponent implements OnInit {

  @Input() request: Request;
  @Input() invitation: Invitation;
 
  constructor(
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public alertCtrl: AlertController,
    public eventService: EventService
  ) {
  }

  ngOnInit() { 
  }
}
