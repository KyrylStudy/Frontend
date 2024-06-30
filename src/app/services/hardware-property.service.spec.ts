import { TestBed } from '@angular/core/testing';

import { HardwarePropertyService } from './hardware-property.service';

describe('HardwarePropertyService', () => {
  let service: HardwarePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardwarePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
