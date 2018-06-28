import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payout-screen',
  templateUrl: './payout-screen.component.html',
  styleUrls: ['./payout-screen.component.scss']
})
export class PayoutScreenComponent implements OnInit {

  @Input() payoutReady: boolean;

  constructor(private web3: Web3Service) { }

  ngOnInit() {

  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

}
