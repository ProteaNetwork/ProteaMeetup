
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDashComponent } from './party-dash.component';

describe('PartyDashComponent', () => {
  let component: PartyDashComponent;
  let fixture: ComponentFixture<PartyDashComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
