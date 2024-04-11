import { TestBed } from '@angular/core/testing';

import { ServicesIncideEcuService } from './services-incide-ecu.service';

describe('ServicesIncideEcuService', () => {
  let service: ServicesIncideEcuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesIncideEcuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
