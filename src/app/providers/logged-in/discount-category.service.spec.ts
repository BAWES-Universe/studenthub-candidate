import { TestBed } from '@angular/core/testing';

import { DiscountCategoryService } from './discount-category.service';

describe('DiscountCategoryService', () => {
  let service: DiscountCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
