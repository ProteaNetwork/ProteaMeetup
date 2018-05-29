import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteaPartyContractComponent } from './protea-party-contract.component';

describe('ProteaPartyContractComponent', () => {
  let component: ProteaPartyContractComponent;
  let fixture: ComponentFixture<ProteaPartyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteaPartyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteaPartyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
