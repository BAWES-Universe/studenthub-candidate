import { TestBed } from '@angular/core/testing';

import { Camera2Service } from './camera2.service';

describe('Camera2Service', () => {
  let service: Camera2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Camera2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
