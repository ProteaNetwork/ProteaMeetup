import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeScreenComponent } from './attendee-screen.component';

describe('AttendeeScreenComponent', () => {
  let component: AttendeeScreenComponent;
  let fixture: ComponentFixture<AttendeeScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
