import { TestBed } from '@angular/core/testing';

import { InitiateService } from './initiate.service';

describe('InitiateService', () => {
  let service: InitiateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitiateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
