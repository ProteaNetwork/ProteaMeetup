import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteaTokenContractComponent } from './protea-token-contract.component';

describe('ProteaTokenContractComponent', () => {
  let component: ProteaTokenContractComponent;
  let fixture: ComponentFixture<ProteaTokenContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteaTokenContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteaTokenContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
