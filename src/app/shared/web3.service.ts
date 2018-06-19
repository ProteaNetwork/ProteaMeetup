import { Injectable } from '@angular/core';

import { UportService } from './uport.service';

import { ICredentials } from './interface/credentials';
import to from 'await-to-js';

declare let window: any;

declare let require: any;
const contract = require('truffle-contract');

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private web3: any;
  public network = 0;
  public ready = false;

  public address: string;

  constructor(private uport: UportService) {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    this.web3 = this.uport.getWeb3();
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }
    const contractAbstraction = this.web3.eth.contract(artifacts.abi);
    return contractAbstraction;

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

  public async login() {
    let user: ICredentials, error: any;

    [user, error] = await to(this.uport.requestCredentials(['name', 'avatar', 'phone']));
    if (!user) { return false; }

    this.address = this.uport.getAddress();
    console.log('post login');
    this.ready = true;
    return true;
  }


  getTransactionReceiptMined(txHash: string, interval: number = null) {
    const transactionReceiptAsync = (resolve, reject) => {
      this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
            reject(error);
        } else if (receipt == null) {
            setTimeout(
                () => transactionReceiptAsync(resolve, reject),
                interval ? interval : 500);
        } else {
            resolve(receipt);
        }
      });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => this.web3.eth.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === 'string') {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error('Invalid Type: ' + txHash);
    }
  }
}
