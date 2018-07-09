import { UportService } from './../../../shared/uport.service';
import { TokenService } from './../../../shared/token.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../../shared/event.service';
import { ProteaParty } from '../../../shared/interface/event';
import { ProteaUser } from '../../../shared/interface/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attendee-screen',
  templateUrl: './attendee-screen.component.html',
  styleUrls: ['./attendee-screen.component.scss']
})
export class AttendeeScreenComponent implements OnInit, OnDestroy {
  public event: ProteaParty;
  private event$: Subscription;
  public user: ProteaUser;
  private user$: Subscription;

  constructor(private eventService: EventService, private tokenService: TokenService, private uportService: UportService) {
    this.user$ = this.uportService.user$.subscribe((_user: ProteaUser) => {
      this.user = _user;
    });

    this.event$ = this.eventService.currentEvent$.subscribe((_currentEvent: ProteaParty) => {
      this.event = _currentEvent;
    });
  }

  ngOnInit() {
    this.updateBalances();
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
    this.event$.unsubscribe();
  }

  async rsvp() {
    await this.tokenService.transfer(this.event.address, this.event.deposit);
    this.uportService.updateUserObject(await this.eventService.fetchUserEventData(this.user));
    this.updateBalances();
  }

  private async updateBalances() {
    this.uportService.updateUserObject(await this.tokenService.updateBalances(this.user));

  }
}
