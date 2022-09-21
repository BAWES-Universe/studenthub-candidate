import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';

import {AuthService} from '../../providers/auth.service';
import {AccountService} from '../../providers/logged-in/account.service';
import {CompanyPage} from '../../pages/logged-in/company/company.page';
import {Candidate} from '../../models/candidate';
import {TranslateLabelService} from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
/**
 * Display alert message to update app on new version availability
 */
@Component({
  selector: 'student-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.scss'],
})
export class AccountStatusComponent implements OnInit {

  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @Input() candidate: Candidate;

  public updating = false;

  constructor(
      public modalCtrl: ModalController,
      public authService: AuthService,
      public accountService: AccountService,
      public toastCtrl: ToastController,
      public eventService: EventService,
      public translateService: TranslateLabelService,
      ) {
  }

  ngOnInit() {

    this.eventService.startWork$.subscribe( () => {
      this.startWorking();
    });

    this.eventService.stopWork$.subscribe( () => {
      this.stopWorking();
    });
  }

  /**
   * Reload app
   */
  refresh() {
    this.onRefresh.emit();
  }

  /**
   * close update prompt
   */
  close() {
    this.onClose.emit();
  }

  /**
   * update job search status
   */
  updateJobSearchStatus() {

    const params = {
      job_search_status: this.authService.candidate_job_search_status == 1 ? 0 : 1
    };

    this.updating = true;

    this.authService.candidate_job_search_status = params.job_search_status;

    this.accountService.updateJobSearchStatus(params).subscribe(data => {

      this.updating = false;

      if (data.operation != 'success') {
        this.authService.candidate_job_search_status = !params.job_search_status; // back to old status
      }
    }, () => {
      this.updating = false;
    });
  }

  /**
   * show popup for company details
   */
  async viewCompanyDetails() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyPage,
      componentProps: {
        company: this.authService.company,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  transform(val:string):string {
    if(val)
      return val.split(' ')[0];
  }

  startWorking() {
    this.accountService.startWork().subscribe(data => {

      if (data.operation == "success") {
        this.candidate.isWorking = data.data;
        this.authService.candidate.isWorking = data.data;
        this.authService.saveLoggedInUser();
      }
      this.toastCtrl.create({
        message: this.authService.errorMessage(data.message),
        duration: 1500
      }).then(toast => toast.present());
    }, () => {
      this.updating = false;
    });
  }

  stopWorking() {
    this.accountService.stopWork().subscribe(data => {
      this.authService.candidate.isWorking = null;
      this.authService.saveLoggedInUser();
      this.candidate.isWorking = null;
      this.toastCtrl.create({
        message: this.authService.errorMessage(data.message),
        duration: 1500
      }).then(toast => toast.present());

    }, () => {
      this.updating = false;
    });
  }
}
