import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NamePage } from './name.page';

describe('NamePage', () => {
  let component: NamePage;
  let fixture: ComponentFixture<NamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
