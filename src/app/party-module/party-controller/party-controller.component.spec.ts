import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyControllerComponent } from './party-controller.component';

describe('PartyControllerComponent', () => {
  let component: PartyControllerComponent;
  let fixture: ComponentFixture<PartyControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
