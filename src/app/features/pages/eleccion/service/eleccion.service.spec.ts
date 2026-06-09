import { TestBed } from '@angular/core/testing';

import { EleccionService } from './eleccion.service';

describe('EleccionService', () => {
  let service: EleccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EleccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
