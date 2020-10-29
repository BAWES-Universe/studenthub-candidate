import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirstImpressionPage } from './first-impression.page';

describe('FirstImpressionPage', () => {
  let component: FirstImpressionPage;
  let fixture: ComponentFixture<FirstImpressionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstImpressionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstImpressionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
