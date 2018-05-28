import { UtilModule } from './util.module';

describe('UtilModule', () => {
  let utilModule: UtilModule;

  beforeEach(() => {
    utilModule = new UtilModule();
  });

  it('should create an instance', () => {
    expect(utilModule).toBeTruthy();
  });
});
