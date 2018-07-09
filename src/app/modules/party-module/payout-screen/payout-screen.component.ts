import { UportService } from './../../../shared/uport.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProteaUser } from '../../../shared/interface/user';
import { Subscription } from 'rxjs';
import { EventService } from '../../../shared/event.service';

@Component({
  selector: 'app-payout-screen',
  templateUrl: './payout-screen.component.html',
  styleUrls: ['./payout-screen.component.scss']
})
export class PayoutScreenComponent implements OnInit, OnDestroy {
  public user: ProteaUser;
  private user$: Subscription;

  constructor(private uportService: UportService, private eventService: EventService) {
    this.user$ = this.uportService.user$.subscribe((_user: ProteaUser) => {
      this.user = _user;
    });
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  public async withdrawTokens() {
    await this.eventService.withdraw();
    this.uportService.updateUserObject(await this.eventService.fetchUserEventData(this.user));
  }
}
