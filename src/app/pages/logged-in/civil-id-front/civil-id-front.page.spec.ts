import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CivilIdFrontPage } from './civil-id-front.page';

describe('CivilIdFrontPage', () => {
  let component: CivilIdFrontPage;
  let fixture: ComponentFixture<CivilIdFrontPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilIdFrontPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CivilIdFrontPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
