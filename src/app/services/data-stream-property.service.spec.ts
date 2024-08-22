import { TestBed } from '@angular/core/testing';

import { DataStreamPropertyService } from './data-stream-property.service';

describe('DataStreamPropertyService', () => {
  let service: DataStreamPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStreamPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
