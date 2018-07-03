import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/event.service';
import { ProteaParty } from '../../../shared/interface/event';

@Component({
  selector: 'app-attendee-screen',
  templateUrl: './attendee-screen.component.html',
  styleUrls: ['./attendee-screen.component.scss']
})
export class AttendeeScreenComponent implements OnInit {
  public event: ProteaParty;
  public userRegistered: boolean;

  constructor(private events: EventService) {
    this.userRegistered = this.events.userRegistered;
    this.event = this.events.event;
  }

  ngOnInit() {
  }
}
