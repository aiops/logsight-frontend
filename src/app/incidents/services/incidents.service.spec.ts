import { TestBed } from '@angular/core/testing';

import { IncidentsService } from './incidents.service';

describe('VerificationService', () => {
  let service: IncidentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
