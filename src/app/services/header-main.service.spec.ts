import { TestBed } from '@angular/core/testing';

import { HeaderMainService } from './header-main.service';

describe('HeaderMainService', () => {
  let service: HeaderMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
