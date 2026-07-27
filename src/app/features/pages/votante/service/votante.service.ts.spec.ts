import { TestBed } from '@angular/core/testing';

import { VotanteServiceTs } from './votante.service.ts';

describe('VotanteServiceTs', () => {
  let service: VotanteServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotanteServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
