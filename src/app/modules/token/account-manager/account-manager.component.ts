import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {

  constructor(private web3: Web3Service) { }

  ngOnInit() {
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }
}
