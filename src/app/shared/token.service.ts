import { Web3Service } from './web3.service';
import { Injectable } from '@angular/core';
import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';


declare let require: any;
let tokenAbi = require('./../../../build/contracts/ERC223StandardToken.json');

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private rinkebyTokenAddress = '0x8e83424d18b41bfb080c8a6c7f9d3e6282dc486b';
  private ropstenTokenAddress = '';
  private tokenContract: TruffleContract;


  constructor(private web3: Web3Service) {
    this.initToken();
  }
  private async initToken() {
    if (this.web3.ready) {
      this.tokenContract = await this.web3.artifactsToContract(tokenAbi);
      this.tokenContract = this.tokenContract.at(this.rinkebyTokenAddress);
      if (this.web3.network === 4) {
        // this.tokenContract.at(this.rinkebyTokenAddress);
      } else if (this.web3.network === 3) {
        // @TODO: Ignore ropsten
        // this.tokenContract.at(this.ropstenTokenAddress);
      }
    } else {
      setTimeout(() => {
        this.initToken();
      }, 200);
    }
  }


  // @TODO convert to async
  faucet() {
    return new Promise((reject, resolve) => {
      this.tokenContract.faucet(async (_error, _txHash) => {
        if (_error) { reject(_error); }
        // Request placed
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve(result);
        // Transation mined
      });
    });
  }

  transfer(_to: string, _amount: number) {
    // Need to add work around in here for overloads
    return new Promise((reject, resolve) => {
      this.tokenContract.transfer(_to, _amount, '', async (_error, _txHash) => {
        if (_error) { reject(_error); }
        // Request placed
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        // Transation mined
      });
    });
  }

  getBalance() {
    console.log('Get Balance');
    return new Promise((resolve, reject) => {
      this.tokenContract.balanceOf(this.web3.address, (_error, _balance) => {
        if (_error) { reject(_error); }
        resolve(_balance.toNumber());
      });
    });
  }

  getIssuedTotal() {
    console.log('Get Issued', this.tokenContract);
    return new Promise((resolve, reject) => {
      this.tokenContract.totalIssuedOf(this.web3.address, (_error, _issuedTotal) => {
        if (_error) { reject(_error); }
        resolve(_issuedTotal.toNumber());
      });
    });
  }


  // Debug
  resetAccount() {
    return new Promise((resolve, reject) => {
      this.tokenContract.resetAccount(this.web3.address, async (_error, _txHash) => {
        if (_error) { reject(_error); }
        // Request placed
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        // Transation mined
        resolve(result);
      });
    });
  }
}
