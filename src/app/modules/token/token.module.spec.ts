import { TokenModule } from './token.module';

describe('TokenModule', () => {
  let tokenModule: TokenModule;

  beforeEach(() => {
    tokenModule = new TokenModule();
  });

  it('should create an instance', () => {
    expect(tokenModule).toBeTruthy();
  });
});
