import { TestBed, inject } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService]
    });
  });

  it('should be created', inject([TokenService], (token: TokenService) => {
    expect(token).toBeTruthy();
  }));
});
