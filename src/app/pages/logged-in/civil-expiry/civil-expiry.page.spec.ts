import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CivilExpiryPage } from './civil-expiry.page';

describe('CivilExpiryPage', () => {
  let component: CivilExpiryPage;
  let fixture: ComponentFixture<CivilExpiryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilExpiryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CivilExpiryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
