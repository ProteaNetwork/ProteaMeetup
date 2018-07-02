import { Web3Service } from './../../../shared/web3.service';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-init-screen',
  templateUrl: './init-screen.component.html',
  styleUrls: ['./init-screen.component.scss']
})
export class InitScreenComponent {
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

  deployContract() {

  }
}
