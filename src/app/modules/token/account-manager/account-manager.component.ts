import { TokenService } from '../../../shared/token.service';
import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {
  public balance = -1;
  public issued = -1;

  constructor(private web3: Web3Service, private tokenService: TokenService ) {
  }

  ngOnInit() {
    this.loadBalances();
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  // Controls

  loadBalances() {
    this.loadBalance();
    this.loadTotal();
  }

  loadTotal() {
    this.tokenService.getIssuedTotal().then((_totalIssued: number) => {
      this.issued = _totalIssued;
    }, (error: any) => {
      console.error('Load Total Error', error);
    });
  }

  loadBalance() {
    this.tokenService.getBalance().then((_balance: number) => {
      this.balance = _balance;
    }, (error: any) => {
      console.error('Load balance error', error);
    });
  }

  claimTokens() {
    this.tokenService.faucet().then((_result: number) => {
      this.balance = _result;
    }, (error) => {
      console.error('Claim total error', error);
    });
  }

  resetAccount() {
    this.tokenService.resetAccount().then((_balance: number) => {
      this.balance = _balance;
      this.issued = 0;
    });
  }

}
