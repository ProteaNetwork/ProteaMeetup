import { ProteaPartyModule } from './protea-party.module';

describe('ProteaPartyModule', () => {
  let proteaPartyModule: ProteaPartyModule;

  beforeEach(() => {
    proteaPartyModule = new ProteaPartyModule();
  });

  it('should create an instance', () => {
    expect(proteaPartyModule).toBeTruthy();
  });
});
