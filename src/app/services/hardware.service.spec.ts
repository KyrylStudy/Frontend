import { TestBed } from '@angular/core/testing';

import { EcuService } from './hardware.service';

describe('EcuService', () => {
  let service: EcuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
