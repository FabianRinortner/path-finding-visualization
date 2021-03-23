import { TestBed } from '@angular/core/testing';

import { DjikstraAlgrothimService } from './djikstra-algrothim.service';

describe('DjikstraAlgrothimService', () => {
  let service: DjikstraAlgrothimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DjikstraAlgrothimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
