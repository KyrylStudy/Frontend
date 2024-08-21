import { TestBed } from '@angular/core/testing';

import { ServiceProperyService } from './service-propery.service';

describe('ServiceProperyService', () => {
  let service: ServiceProperyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProperyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
