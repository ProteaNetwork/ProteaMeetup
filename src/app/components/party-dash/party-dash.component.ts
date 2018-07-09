import { ICredentials } from './../../shared/interface/credentials';
import { UportService } from './../../shared/uport.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-dash',
  templateUrl: './party-dash.component.html',
  styleUrls: ['./party-dash.component.scss']
})
export class PartyDashComponent implements OnInit {
  credentials: ICredentials;

  constructor(private uportService: UportService) {
  }

  ngOnInit() {
    this.credentials = this.uportService.credentials;
  }
}
