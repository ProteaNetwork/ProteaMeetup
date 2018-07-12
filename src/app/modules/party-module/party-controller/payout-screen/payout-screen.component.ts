import { UportService } from '../../../../shared/services/uport.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProteaUser } from '../../../../shared/interface/user';
import { EventService } from '../../../../shared/services/event.service';

@Component({
  selector: 'app-payout-screen',
  templateUrl: './payout-screen.component.html',
  styleUrls: ['./payout-screen.component.scss']
})
export class PayoutScreenComponent implements OnInit {

  @Input() user: ProteaUser;

  constructor(private uportService: UportService, private eventService: EventService) {}

  ngOnInit() {
  }


  public async withdrawTokens() {
    await this.eventService.withdraw();
    this.uportService.updateUserObject(await this.eventService.fetchUserEventData(this.user));
  }
}
