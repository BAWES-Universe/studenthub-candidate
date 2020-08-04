import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateOfBirthPage } from './date-of-birth.page';

describe('DateOfBirthPage', () => {
  let component: DateOfBirthPage;
  let fixture: ComponentFixture<DateOfBirthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateOfBirthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DateOfBirthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
