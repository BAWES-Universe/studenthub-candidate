import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadVideoPage } from './upload-video.page';

describe('UploadVideoPage', () => {
  let component: UploadVideoPage;
  let fixture: ComponentFixture<UploadVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
