import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutScreenComponent } from './payout-screen.component';

describe('PayoutScreenComponent', () => {
  let component: PayoutScreenComponent;
  let fixture: ComponentFixture<PayoutScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
