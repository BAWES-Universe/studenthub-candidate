import { Component, OnInit, Input } from '@angular/core';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
    selector: 'loading-modal',
    templateUrl: './loading-modal.component.html',
    styleUrls: ['./loading-modal.component.scss'],
})
export class LoadingModalComponent implements OnInit {

    @Input() type: string;
    @Input() loading: boolean;

    constructor(
        public translateService: TranslateLabelService
    ) {
    }

    ngOnInit() {
    }
}
