import { TokenService } from './../../../shared/token.service';
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
  public userRsvp: boolean;
  public balance = 0;

  constructor(private eventService: EventService, private tokenService: TokenService) {
  }

  async ngOnInit() {
    this.balance = await this.tokenService.getBalance();
    this.userRsvp = this.eventService.userRegistered;
    this.event = this.eventService.event;
  }

  async rsvp() {
    await this.tokenService.transfer(this.event.address, this.event.deposit);
    await this.eventService.checkRegistered();
    this.userRsvp = this.eventService.userRegistered;
    this.balance = await this.tokenService.getBalance();
    this.event = this.eventService.event;

  }
}
