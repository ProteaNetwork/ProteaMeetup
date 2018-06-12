import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';
import * as TruffleContract from 'truffle-contract';
import { ContractsService } from '../../../shared/contracts.service';


@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {
  private userProfile: any;
  public tokenContract: TruffleContract;
  public balance = 0;
  public issued = 0;

  constructor(private web3: Web3Service, private contracts: ContractsService, ) {
    this.userProfile = this.web3.userCredentials;
  }

  ngOnInit() {
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  // Controls
  async claimTokens() {
    const address = this.up
    const status = await this.contracts.faucet();
    console.log(status);
  }
}
