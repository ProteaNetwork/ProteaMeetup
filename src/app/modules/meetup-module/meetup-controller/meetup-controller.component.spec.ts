import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetupControllerComponent } from './meetup-controller.component';

describe('MeetupControllerComponent', () => {
  let component: MeetupControllerComponent;
  let fixture: ComponentFixture<MeetupControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetupControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetupControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
