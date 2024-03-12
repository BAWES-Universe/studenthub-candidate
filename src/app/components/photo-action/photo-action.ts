import { NavParams, PopoverController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
    template: `
      <ion-list>
        <ion-list-header><ion-label>{{ "Select Action" | translate }}</ion-label></ion-list-header>
        <ion-item (click)="close('browse')" tappable>
            <div tabindex="0"></div>
            <ion-icon name="albums"  slot="end" ></ion-icon> {{ "Select Photo" | translate }}
        </ion-item>
        <ion-item lines="none" (click)="close('remove')" tappable>
            <div tabindex="0"></div>
            <ion-icon name="trash"  slot="end" ></ion-icon> {{ "Remove Photo" | translate }}
        </ion-item>
      </ion-list>
    `
})
export class PhotoActionComponent {

    private fileInput;

    constructor(public popCtrl: PopoverController, navParams: NavParams) {
        this.fileInput = navParams.get('fileInput');
    }

    close(data) {
        /**
         * Broser prevent click on file input, so have to call click from here
         */
        if (data == 'browse') {
            this.fileInput.click();

            // let e = document.querySelector('.header .upload') as HTMLElement
            // e.click();
        }

        this.popCtrl.getTop().then(overlay => {
            if (overlay) {
              this.popCtrl.dismiss({ action: data });
            }
        });
    }

    ngOnDestroy() {
        
    }
}
