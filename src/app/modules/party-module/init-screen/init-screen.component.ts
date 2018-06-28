import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-init-screen',
  templateUrl: './init-screen.component.html',
  styleUrls: ['./init-screen.component.scss']
})
export class InitScreenComponent implements OnInit {
  public loading = false;
  public address: string;

  @Output() contractAddress = new EventEmitter<string>();

  constructor(private web3: Web3Service) { }

  ngOnInit() {
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  fetchContract() {
    this.loading = true;
    console.log('loading');
    this.contractAddress.emit(this.address);
  }

  deployContract() {

  }
}
