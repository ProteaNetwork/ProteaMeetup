import { TokenService } from '../../../shared/token.service';
import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {
  public balance = 0;
  public issued = 0;

  constructor(private web3: Web3Service, private tokenService: TokenService ) {
  }

  ngOnInit() {
    console.log('in init');
    this.tokenService.getBalance();
  }

  isValidAddress(address: string) {
    return this.web3.isValidAddress(address);
  }

  // Controls
  async claimTokens() {
    const status = await this.tokenService.faucet();
    console.log(status);
  }
}
