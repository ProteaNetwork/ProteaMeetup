import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Web3Service } from '../../../shared/web3.service';

@Component({
  selector: 'app-fetch',
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.scss']
})
export class FetchComponent  {
  public loading = false;
  public events: string[];

  @Input() deployedEvents: string[];
  @Output() contractAddress = new EventEmitter<string>();


  constructor(private web3: Web3Service) { }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  fetchContract(address: string) {
    this.loading = true;
    this.contractAddress.emit(address);
  }

}
