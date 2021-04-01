import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

import {AuthService} from '../../providers/auth.service';
import {AccountService} from '../../providers/logged-in/account.service';
import {CompanyPage} from '../../pages/logged-in/company/company.page';
import {Candidate} from '../../models/candidate';
import {TranslateLabelService} from 'src/app/providers/translate-label.service';

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
      public translateService: TranslateLabelService,
      ) {
  }

  ngOnInit() {
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
}
