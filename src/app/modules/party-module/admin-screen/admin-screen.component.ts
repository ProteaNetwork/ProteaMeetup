import { UportService } from './../../../shared/uport.service';
import { EventService } from './../../../shared/event.service';
import { Component, OnInit } from '@angular/core';
import { ProteaParty } from '../../../shared/interface/event';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  public event: ProteaParty;
  private event$: Subscription;
  public attending: string[] = [];
  public loading = false;

  constructor(private uportService: UportService, private eventService: EventService) {
    this.event$ = this.eventService.currentEvent$.subscribe((_currentEvent: ProteaParty) => {
      this.event = _currentEvent;
    });
  }

  // @TODO: remove when PoAtt is set up
  isValidAddress(address: string) {
    return this.uportService.isValidAddress(address);
  }

  ngOnInit() {
  }

  public async changeLimit(_newLimit: number) {
    if (!this.loading) {
      this.loading = true;
      await this.eventService.setLimit(_newLimit);
      // Display confirmation of sorts
      this.loading = false;
    }
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


  public async clearEvent() {
    if (!this.loading && this.event.ended) {
      this.loading = true;
      await this.eventService.cancel();
      // Display confirmation of sorts
      this.loading = false;
    }
  }

  // Consideration: Do I need the destroy feature, possibly to prevent cluttering the ui
}

