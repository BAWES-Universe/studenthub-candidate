import { TestBed } from '@angular/core/testing';

import { CandidateNotificationService } from './candidate-notification.service';

describe('CandidateNotificationService', () => {
  let service: CandidateNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
