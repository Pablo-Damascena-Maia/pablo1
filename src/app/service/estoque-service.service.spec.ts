import { TestBed } from '@angular/core/testing';

import { EstoqueService } from './estoque-service.service';

describe('EstoqueServiceService', () => {
  let service: EstoqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstoqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
function beforeEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}

function expect(service: EstoqueService) {
  throw new Error('Function not implemented.');
}

