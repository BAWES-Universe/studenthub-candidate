import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrivingLicensePage } from './driving-license.page';

describe('DrivingLicensePage', () => {
  let component: DrivingLicensePage;
  let fixture: ComponentFixture<DrivingLicensePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivingLicensePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrivingLicensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
