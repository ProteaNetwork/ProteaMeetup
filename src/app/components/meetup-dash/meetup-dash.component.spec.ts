
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetupDashComponent } from './Meetup-dash.component';

describe('MeetupDashComponent', () => {
  let component: MeetupDashComponent;
  let fixture: ComponentFixture<MeetupDashComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetupDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetupDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
