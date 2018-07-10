import { ICredentials } from './../../shared/interface/credentials';
import { UportService } from './../../shared/uport.service';
import { Component, OnInit } from '@angular/core';
import { ProteaUser } from '../../shared/interface/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-party-dash',
  templateUrl: './party-dash.component.html',
  styleUrls: ['./party-dash.component.scss']
})
export class PartyDashComponent implements OnInit {
  public user: ProteaUser;
  private user$: Subscription;

  constructor(private uportService: UportService) {
    this.user$ = this.uportService.user$.subscribe(
      (_user: ProteaUser) => this.user = _user
    );
  }

  ngOnInit() {
  }
}
