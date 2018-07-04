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


  async onFetch(_address: string) {
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
    } else {
      // Error
    }
  }

  async onDeploy(_eventData: any) {
    this.eventService.deployEvent(_eventData.name, _eventData.deposit, _eventData.limit, _eventData.cooldown, '').then(async result => {
      await this.checkEvents();
      this.onFetch(this.events[this.events.length - 1]);
    }, error => {
      console.log('Event Deploy Error', error);
    });
  }
}

