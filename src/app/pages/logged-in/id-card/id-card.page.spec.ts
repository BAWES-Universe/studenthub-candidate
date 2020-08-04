import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IdCardPage } from './id-card.page';

describe('IdCardPage', () => {
  let component: IdCardPage;
  let fixture: ComponentFixture<IdCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IdCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
