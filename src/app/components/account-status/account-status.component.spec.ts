import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatusComponent } from './account-status.component';
import { AccountStatusModule } from './account-status.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';

describe('AccountStatusComponent', () => {
  let component: AccountStatusComponent;
  let fixture: ComponentFixture<AccountStatusComponent>;

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
      fixture = TestBed.createComponent(AccountStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
