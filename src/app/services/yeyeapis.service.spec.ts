import { TestBed } from '@angular/core/testing';

import { YeyeapisService } from './yeyeapis.service';

describe('YeyeapisService', () => {
  let service: YeyeapisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YeyeapisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
