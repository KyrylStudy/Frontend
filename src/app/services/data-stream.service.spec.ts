import { TestBed } from '@angular/core/testing';

import { LineCreationService } from './data-stream.service';

describe('HeaderMainService', () => {
  let service: LineCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
