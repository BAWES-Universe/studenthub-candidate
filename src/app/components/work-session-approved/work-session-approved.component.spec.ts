import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkSessionApprovedComponent } from './work-session-approved.component';

describe('WorkSessionApprovedComponent', () => {
  let component: WorkSessionApprovedComponent;
  let fixture: ComponentFixture<WorkSessionApprovedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkSessionApprovedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkSessionApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
