import { EventService } from './../../../shared/event.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payout-screen',
  templateUrl: './payout-screen.component.html',
  styleUrls: ['./payout-screen.component.scss']
})
export class PayoutScreenComponent implements OnInit {
  public userPaid = false;

  constructor(private eventService: EventService) { }

  async ngOnInit() {
    await this.eventService.checkPaid();
    this.userPaid = this.eventService.userPaid;
  }

  public async withdrawTokens() {
    await this.eventService.withdraw();
    this.userPaid = this.eventService.userPaid;
  }
}
