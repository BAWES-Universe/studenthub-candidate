import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletBalanceListPage } from './wallet-balance-list.page';

describe('WalletBalanceListPage', () => {
  let component: WalletBalanceListPage;
  let fixture: ComponentFixture<WalletBalanceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletBalanceListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletBalanceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
