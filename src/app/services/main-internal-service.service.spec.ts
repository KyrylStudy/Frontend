import { TestBed } from '@angular/core/testing';

import { MainInternalServiceService } from './main-internal-service.service';

describe('MainInternalServiceService', () => {
  let service: MainInternalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainInternalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
