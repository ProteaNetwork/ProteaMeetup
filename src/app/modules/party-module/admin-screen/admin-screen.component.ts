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
  public attending: string[];
  public loading = false;

  constructor(private web3: Web3Service, private eventService: EventService) {
    this.event = this.eventService.event;
  }

  // @TODO: remove when PoAtt is set up
  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  ngOnInit() {
  }

  public addToSubmission(_address: string) {
    if (this.attending.indexOf(_address) < 0) {
      this.attending.push(_address);
    }
  }

  public async manualSubmitAttendance() {
    if (!this.loading) {
      this.loading = true;
      await this.eventService.manualConfirmAttend(this.attending);
      // Display confirmation of sorts
      this.loading = false;
    }
  }

  public async endEvent() {
    if (!this.loading) {
      this.loading = true;
      await this.eventService.paybackEnd();
      // Display confirmation of sorts
      this.loading = false;
    }
  }

  public async cancelEvent() {
    if (!this.loading) {
      this.loading = true;
      await this.eventService.cancel();
      // Display confirmation of sorts
      this.loading = false;
    }
  }

  // Consideration: Do I need the destroy feature, possibly to prevent cluttering the ui
}

