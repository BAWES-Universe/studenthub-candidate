import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CivilIdBackPage } from './civil-id-back.page';

describe('CivilIdBackPage', () => {
  let component: CivilIdBackPage;
  let fixture: ComponentFixture<CivilIdBackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilIdBackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CivilIdBackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
