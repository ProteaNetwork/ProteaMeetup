import { UportService } from './../../../shared/uport.service';
import { ProteaParty } from './../../../shared/interface/event';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fetch',
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.scss']
})
export class FetchComponent  {
  public loading = false;
  public events: string[];

  @Input() deployedEvents: ProteaParty[];
  @Output() contractAddress = new EventEmitter<string>();


  constructor(private uportService: UportService) { }

  isValidAddress(address: string) {
    return this.uportService.isValidAddress(address);
  }

  fetchContract(address: string) {
    this.loading = true;
    this.contractAddress.emit(address);
  }

}
