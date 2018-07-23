import { UportService } from '../../shared/services/uport.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProteaUser } from '../../shared/interface/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meetup-dash',
  templateUrl: './meetup-dash.component.html',
  styleUrls: ['./meetup-dash.component.scss']
})
export class MeetupDashComponent implements OnInit, OnDestroy {
  public user: ProteaUser;
  private user$: Subscription;

  constructor(private uportService: UportService) {
    this.user$ = this.uportService.user$.subscribe(
      (_user: ProteaUser) => this.user = _user
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
