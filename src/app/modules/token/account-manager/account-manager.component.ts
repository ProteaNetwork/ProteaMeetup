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
    // this.loadBalances();
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  // Controls

  loadBalances() {
    console.log('in init');
    // Need to refactor this
    this.tokenService.getIssuedTotal().then((_totalIssued: number) => {
      this.issued = _totalIssued;
      console.log('TokenService succeded', this.issued);
      if (this.issued > 0) {
        this.tokenService.getBalance().then((_balance: number) => {
          this.balance = _balance;
        });
      }
    });
  }

  loadTotal() {
    this.tokenService.getIssuedTotal().then((_totalIssued: number) => {
      this.issued = _totalIssued;
      console.log('success', _totalIssued);
    }, (error: any) => {
      console.log('error', error);
    });
  }

  loadBalance() {
    this.tokenService.getBalance().then((_balance: number) => {
      this.balance = _balance;
      console.log('success', this.balance);
    }, (error: any) => {
      console.log('error', error);
    });
  }

  claimTokens() {
    this.tokenService.faucet().then((_result: number) => {
      this.balance = _result;
    }, (error) => {
      console.log(error);
    });
  }

  resetAccount() {
    this.tokenService.resetAccount().then((_balance: number) => {
      this.balance = _balance;
      this.issued = 0;
    });
  }

}
