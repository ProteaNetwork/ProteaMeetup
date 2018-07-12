import { UportService } from '../../../../shared/services/uport.service';
import { TokenService } from '../../../../shared/services/token.service';
import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../../../../shared/services/event.service';
import { ProteaParty } from '../../../../shared/interface/event';
import { ProteaUser } from '../../../../shared/interface/user';

@Component({
  selector: 'app-attendee-screen',
  templateUrl: './attendee-screen.component.html',
  styleUrls: ['./attendee-screen.component.scss']
})
export class AttendeeScreenComponent implements OnInit {
  @Input() event: ProteaParty;
  @Input() user: ProteaUser;

  constructor(private eventService: EventService, private tokenService: TokenService, private uportService: UportService) {
  }

  ngOnInit() {
    this.updateBalances();
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
