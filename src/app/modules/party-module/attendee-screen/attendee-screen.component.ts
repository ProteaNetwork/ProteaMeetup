import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/event.service';

@Component({
  selector: 'app-attendee-screen',
  templateUrl: './attendee-screen.component.html',
  styleUrls: ['./attendee-screen.component.scss']
})
export class AttendeeScreenComponent implements OnInit {
  public name: string;
  public registered: number;
  public limit: number;
  public deposit: number;
  public userRegistered: boolean;

  constructor(private events: EventService) {
    this.name = this.events.eventName;
    this.deposit = this.events.eventDeposit;
    this.registered = this.events.eventRegistered;
    this.limit = this.events.eventLimit;
    this.userRegistered = this.events.userRegistered;
  }

  ngOnInit() {
  }
}
