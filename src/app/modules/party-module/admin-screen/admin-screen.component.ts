import { EventService } from './../../../shared/event.service';
import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';
import { ProteaParty } from '../../../shared/interface/event';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  public event: ProteaParty;

  constructor(private web3: Web3Service, private eventService: EventService) {
    this.event = this.eventService.event;
  }

  // @TODO: remove when PoAtt is set up
  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  ngOnInit() {
  }

}
