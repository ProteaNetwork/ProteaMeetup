import { Web3Service } from './../shared/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-error',
  templateUrl: './provider-error.component.html',
  styleUrls: ['./provider-error.component.scss']
})
export class ProviderErrorComponent implements OnInit {
  public errorMessage: string;

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    this.checkWeb3();
  }

  checkWeb3() {
    console.log(this.web3.accountsObservable);
    if (!this.web3.ready) {
      this.errorMessage = 'Please install MetaMask or Cypherbrowser';
    }
    // setTimeout(this.checkWeb3(), 2000);
  }
}
