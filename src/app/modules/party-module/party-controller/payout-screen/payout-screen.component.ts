import { UportService } from '../../../../shared/services/uport.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProteaUser } from '../../../../shared/interface/user';
import { EventService } from '../../../../shared/services/event.service';
import { ProteaMeetup } from '../../../../shared/interface/event';

@Component({
  selector: 'app-payout-screen',
  templateUrl: './payout-screen.component.html',
  styleUrls: ['./payout-screen.component.scss']
})
export class PayoutScreenComponent implements OnInit {

  @Input() public user: ProteaUser;
  @Input() public event: ProteaMeetup;

  constructor(private uportService: UportService, private eventService: EventService) {}

  ngOnInit() {
  }


  public async withdrawTokens() {
    await this.eventService.withdraw();
    this.uportService.updateUserObject(await this.eventService.fetchUserEventData(this.user));
  }
}
