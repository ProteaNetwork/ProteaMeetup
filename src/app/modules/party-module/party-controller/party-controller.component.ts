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

  public events: string[];

  constructor(private eventService: EventService) { }

  async ngOnInit() {
    await this.checkEvents();
  }

  checkEvents() {
    this.eventService.fetchAdminEvents().then((results: string[]) => {
      console.log(results);
      this.events = results;
    }, error => {
      console.log('Event Fetch Error', error);
    });
  }


  async onFetch(_address: string) {
    if (await this.eventService.fetchEvent(_address)) {
      if (this.eventService.userAdmin) {
        this.state = 'admin';
      } else {
        if (this.eventService.eventEnded) {
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
     this.eventService.deployEvent('Testing', 200, 12, 2, '').then(result => {
      // need to run mining
      this.checkEvents();
    }, error => {
      console.log('Event Fetch Error', error);
    });
  }
}

