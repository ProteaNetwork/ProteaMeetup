import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/event.service';

@Component({
  selector: 'app-party-controller',
  templateUrl: './party-controller.component.html',
  styleUrls: ['./party-controller.component.scss']
})
export class PartyControllerComponent implements OnInit {
  // @TODO: swap to enum
  public state = 'init';
  public loading = false;

  public events: string[];

  constructor(private eventService: EventService) { }

  async ngOnInit() {
    await this.checkEvents();
  }

  checkEvents() {
    return new Promise((resolve, reject) => {
      this.eventService.fetchAdminEvents().then((results: string[]) => {
        console.log(results);
        this.events = results;
        resolve();
      }, error => {
        console.log('Event Fetch Error', error);
        reject(error);
      });
    });
  }
  onSelection (_state: string) {
    this.state = _state;
  }


  async onFetch(_address: string) {
    this.loading = true;
    if (await this.eventService.fetchEvent(_address)) {
      if (this.eventService.userAdmin) {
        this.state = 'admin';
      } else {
        if (this.eventService.event.ended) {
          this.state = 'payout';
        } else {
          this.state = 'attendee';
        }
      }
      this.loading = false;

    } else {
      // Error
      this.loading = false;
    }
  }

  async onDeploy(_eventData: any) {
    this.loading = true;
    this.eventService.deployEvent(_eventData.name, _eventData.deposit, _eventData.limit, _eventData.cooldown, '').then(async result => {
      console.log('waiting')
      await this.checkEvents();
      console.log('fetching')
      this.onFetch(this.events[this.events.length - 1]);
    }, error => {
      console.log('Event Deploy Error', error);
      this.loading = false;
    });
  }
}

