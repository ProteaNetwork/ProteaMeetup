import { UportService } from '../../../shared/services/uport.service';
import { Subscription } from 'rxjs';
import { ProteaParty } from './../../../shared/interface/event';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../../shared/services/event.service';
import { ProteaUser } from '../../../shared/interface/user';
import { EventState } from '../enum/event-state.enum';

@Component({
  selector: 'app-party-controller',
  templateUrl: './party-controller.component.html',
  styleUrls: ['./party-controller.component.scss']
})
export class PartyControllerComponent implements OnInit, OnDestroy {
  // @TODO: swap to enum & observable
  public state: EventState = EventState.INIT;
  public loading = false;

  public events: ProteaParty[];
  private  events$: Subscription;

  public currentEvent: ProteaParty;
  private currentEvent$: Subscription;

  public user: ProteaUser;
  private user$: Subscription;

  constructor(private eventService: EventService, private uportService: UportService) {
    this.events$ = this.eventService.events$.subscribe(
      (_events: ProteaParty[]) =>
      this.events = _events
    );
    this.user$ = this.uportService.user$.subscribe(
      (_user: ProteaUser) =>
      this.user = _user
    );
    this.currentEvent$ = this.eventService.currentEvent$.subscribe(
      (_event: ProteaParty) =>
      this.currentEvent = _event
    );
  }

  async ngOnInit() {
    await this.eventService.initWait();
    await this.eventService.fetchAdminEvents();
  }

  ngOnDestroy() {
    this.events$.unsubscribe();
    this.currentEvent$.unsubscribe();
    this.user$.unsubscribe();
  }

  onSelection (_state: string) {
    this.state = EventState[_state];
  }


  async onFetch(_address: string) {
    this.loading = true;
    if (await this.eventService.fetchEvent(_address)) {
      await this.fetchUserState();
      if (this.user.isAdmin) {
        this.state = EventState.ADMIN;
      } else {
        if (this.currentEvent.ended) {
          this.state = EventState.PAYOUT;
        } else {
          this.state = EventState.ATTENDEE;
        }
      }
      this.loading = false;

    } else {
      // Error
      this.loading = false;
    }
  }

  async fetchUserState() {
    this.uportService.updateUserObject(await this.eventService.fetchUserEventData(this.user));
  }

  async onDeploy(_eventData: any) {
    this.loading = true;
    this.eventService.deployEvent(_eventData.name, _eventData.deposit, _eventData.limit, _eventData.cooldown, '').then(async result => {
      await this.eventService.fetchAdminEvents();
      this.onFetch(this.events[this.events.length - 1].address);
    }, error => {
      console.log('Event Deploy Error', error);
      this.loading = false;
    });
  }
}

