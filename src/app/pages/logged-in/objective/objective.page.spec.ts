import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ObjectivePage } from './objective.page';

describe('ObjectivePage', () => {
  let component: ObjectivePage;
  let fixture: ComponentFixture<ObjectivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
