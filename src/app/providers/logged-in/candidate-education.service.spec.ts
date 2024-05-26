import { TestBed } from '@angular/core/testing';

import { CandidateEducationService } from './candidate-education.service';

describe('CandidateEducationService', () => {
  let service: CandidateEducationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateEducationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
