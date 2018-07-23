import { ProteaMeetupModule } from './protea-meetup.module';

describe('ProteaMeetupModule', () => {
  let proteaMeetupModule: ProteaMeetupModule;

  beforeEach(() => {
    proteaMeetupModule = new ProteaMeetupModule();
  });

  it('should create an instance', () => {
    expect(proteaMeetupModule).toBeTruthy();
  });
});
