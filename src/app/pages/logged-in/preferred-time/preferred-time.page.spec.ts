import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreferredTimePage } from './preferred-time.page';

describe('PreferredTimePage', () => {
  let component: PreferredTimePage;
  let fixture: ComponentFixture<PreferredTimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredTimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferredTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
