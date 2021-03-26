import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitationDetailPage } from './invitation-detail.page';

describe('InvitationDetailPage', () => {
  let component: InvitationDetailPage;
  let fixture: ComponentFixture<InvitationDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
