import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/event.service';

@Component({
  selector: 'app-party-controller',
  templateUrl: './party-controller.component.html',
  styleUrls: ['./party-controller.component.scss']
})
export class PartyControllerComponent implements OnInit {
  private address: string;

  // @TODO: swap to enum
  public state = 'init';

  constructor(private events: EventService) { }

  ngOnInit() {
  }

  async checkEvents() {
    this.events.fetchAdminEvents().then(result => {
      console.log('Events Fetched', result);
    }, error => {
      console.log('Event Fetch Error', error);
    });
  }

  async onFetch(_address: string) {
    console.log("in control on fetch")
    if (await this.events.fetchEvent(_address)) {
      console.log('event is ready');
      if (this.events.userAdmin) {
        this.state = 'admin';
      } else {
        if (this.events.eventEnded) {
          this.state = 'payout';
        } else {
          this.state = 'attendee';
        }
      }
    } else {
      // Error
    }
  }

  async onDeploy() {
     this.events.deployEvent('Testing', 200, 12, 2, '').then(result => {
      console.log('Events Fetched', result);
      this.checkEvents();
    }, error => {
      console.log('Event Fetch Error', error);
    });
  }
}

