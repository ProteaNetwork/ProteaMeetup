import { Injectable } from '@angular/core';

import * as TruffleContract from 'truffle-contract';
import { Subject } from 'rxjs';
import { UportService } from './uport.service';


declare let window: any;


@Injectable({
  providedIn: 'root'
})
export class Web3Service {
 
  private web3: any;
  private accounts: string[];
  public network = 0;
  public ready = false;
  public accountsObservable = new Subject<string[]>();

  constructor(private uport: UportService) {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    this.web3 = this.uport.getWeb3();
    this.ready = true;
    // setInterval(() => this.refreshAccounts(), 100);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = TruffleContract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      // console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      this.checkNetwork();
    });
  }
  public checkNetwork(): void {
    this.web3.version.getNetwork((err, netId: string) => {
      if (netId === '4' || netId === '3') {
        this.ready = true;
        this.network = parseInt(netId, 10);
      } else {
        this.ready = false;
      }
    });
  }

  // Checks
  public isValidAddress(address: string): boolean {
    return this.web3.isAddress(address);
  }

  public async getCoinBase() {
    let temp;
     await this.web3.eth.getCoinbase((error, result) => {
      console.log(result);
      temp = result;
    });
    return temp;
  }

}
