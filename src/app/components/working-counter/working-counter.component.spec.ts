import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingCounterComponent } from './account-status.component';
import { AccountStatusModule } from './account-status.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';

describe('WorkingCounterComponent', () => {
  let component: WorkingCounterComponent;
  let fixture: ComponentFixture<WorkingCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [
        AppModule,
        AccountStatusModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(WorkingCounterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
