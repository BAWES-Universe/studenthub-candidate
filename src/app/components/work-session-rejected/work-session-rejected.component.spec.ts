import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkSessionRejectedComponent } from './work-session-rejected.component';

describe('WorkSessionRejectedComponent', () => {
  let component: WorkSessionRejectedComponent;
  let fixture: ComponentFixture<WorkSessionRejectedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkSessionRejectedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkSessionRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
