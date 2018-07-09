import { UportService } from './../../../shared/uport.service';
import { TokenService } from '../../../shared/token.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {
  public balance = -1;
  public issued = -1;
  private transacting = false;

  constructor(private uportService: UportService, private tokenService: TokenService ) {
  }

  ngOnInit() {
    this.loadBalances();
  }

  isValidAddress(address: string) {
    return this.uportService.isValidAddress(address);
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
    if (!this.transacting) {
      this.transacting = true;
      this.tokenService.faucet().then((_result) => {
        this.transacting = false;
        this.loadBalances();
        }, (error) => {
        this.transacting = false;
        console.error('Claim total error', error);
      });
    }
  }

  resetAccount() {
    if (!this.transacting) {
      this.transacting = true;
      this.tokenService.resetAccount().then((_result) => {
        this.transacting = false;
        this.loadBalances();
        }, (error) => {
          this.transacting = false;
          console.error('Claim total error', error);
      });
    }
  }

}
