import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NationalIdPage } from './national-id.page';

describe('NationalIdPage', () => {
  let component: NationalIdPage;
  let fixture: ComponentFixture<NationalIdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationalIdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NationalIdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
