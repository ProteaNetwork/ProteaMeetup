import { UportService } from '../../../../shared/services/uport.service';
import { ProteaMeetup } from './../../../../shared/interface/event';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fetch',
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.scss']
})
export class FetchComponent  {
  public loading = false;
  public events: ProteaMeetup[];

  @Input() deployedEvents: ProteaMeetup[];
  @Output() contractAddress = new EventEmitter<string>();


  constructor(private uportService: UportService) {
  }

  isValidAddress(address: string) {
    return this.uportService.isValidAddress(address);
  }

  fetchContract(address: string) {
    this.loading = true;
    this.contractAddress.emit(address);
  }

}
