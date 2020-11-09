import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KuwaitiNationalPage } from './kuwaiti-national.page';

describe('KuwaitiNationalPage', () => {
  let component: KuwaitiNationalPage;
  let fixture: ComponentFixture<KuwaitiNationalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KuwaitiNationalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KuwaitiNationalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
