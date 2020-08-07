import { Component, OnInit } from '@angular/core';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    public platform: Platform,
    public _translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }

}
