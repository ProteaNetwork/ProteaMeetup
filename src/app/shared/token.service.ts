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
  private rinkebyTokenAddress = '0x689065ac51ca79c891f5b9292b5da15231858baa';
  private tokenContract: TruffleContract;
  // Duplicated bool in account manager as random double request were sent to device even with this
  private transacting = false;

  constructor(private web3: Web3Service) {
    this.initToken();
  }

  private async initToken() {
    if (this.web3.ready) {
      this.tokenContract = await this.web3.artifactsToContract(tokenAbi);
      this.tokenContract = this.tokenContract.at(this.rinkebyTokenAddress);
    } else {
      setTimeout(() => {
        this.initToken();
      }, 200);
    }
  }

  // @TODO convert to async
  faucet() {
    return new Promise((resolve, reject) => {
      if (!this.transacting) {
        this.transacting = true;

        this.tokenContract.faucet(async (_error, _txHash) => {
          if (_error) { reject(_error); }
          // Request placed
          let error, result;
          [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
          if (!result.blockNumber) {reject(error); }
          // Transation mined
          this.transacting = false;
          resolve(result);
        });
      }
    });
  }

  transfer(_to: string, _amount: number) {
    // Need to add work around in here for overloads
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      this.tokenContract.balanceOf(this.web3.address, (_error, _balance) => {
        if (_error) { reject(_error); }
        resolve(_balance.toNumber());
      });
    });
  }

  getIssuedTotal() {
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
      if (!this.transacting) {
        this.transacting = true;
        this.tokenContract.resetAccount(this.web3.address, async (_error, _txHash) => {
          if (_error) { reject(_error); }
          // Request placed
          let error, result;
          [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
          if (!result.blockNumber) { reject(error); }
          // Transation mined
          this.transacting = false;
          resolve(result);
        });
      }
    });
  }
}
