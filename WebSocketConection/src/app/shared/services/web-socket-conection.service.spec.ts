import { TestBed } from '@angular/core/testing';

import { WebSocketConectionService } from './web-socket-conection.service';

describe('WebSocketConectionService', () => {
  let service: WebSocketConectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketConectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
