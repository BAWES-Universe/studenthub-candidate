import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NameArPage } from './name-ar.page';

describe('NameArPage', () => {
  let component: NameArPage;
  let fixture: ComponentFixture<NameArPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameArPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NameArPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
