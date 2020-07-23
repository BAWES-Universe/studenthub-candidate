import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailPage } from './email.page';

describe('EmailPage', () => {
  let component: EmailPage;
  let fixture: ComponentFixture<EmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
