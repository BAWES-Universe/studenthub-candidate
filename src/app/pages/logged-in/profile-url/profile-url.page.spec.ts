import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileUrlPage } from './profile-url.page';

describe('ProfileUrlPage', () => {
  let component: ProfileUrlPage;
  let fixture: ComponentFixture<ProfileUrlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUrlPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUrlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
