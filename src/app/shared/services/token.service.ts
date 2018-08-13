import { UportService } from './uport.service';
import { Injectable } from '@angular/core';
import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';
import { ProteaUser } from '../interface/user';


declare let require: any;
const tokenAbi = require('./../../../../build/contracts/ERC223StandardToken.json');

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private rinkebyTokenAddress = '0x03c7258bc679daab3aaddd09ffe647f1fd0415e1';
  private tokenContract: TruffleContract;
  // Duplicated bool in account manager as random double request were sent to device even with this
  private transacting = false;

  constructor(private uportService: UportService) {
    this.initToken();
  }

  private async initToken() {
      this.tokenContract = await this.uportService.artifactsToContract(tokenAbi);
      this.tokenContract = this.tokenContract.at(this.rinkebyTokenAddress);

    // @TODO: Hook up to user object
    // if (this.uportService.ready) {
    //   this.tokenContract = await this.uportService.artifactsToContract(tokenAbi);
    //   this.tokenContract = this.tokenContract.at(this.rinkebyTokenAddress);
    // } else {
    //   setTimeout(() => {
    //     this.initToken();
    //   }, 200);
    // }
  }

  // @TODO: Need better solution
  public async initWait() {
    if (!this.tokenContract) {
      const delay = new Promise(finish => setTimeout(finish, 100));
      await delay;
      return await this.initWait();
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
          [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
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
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        // Transation mined
      });
    });
  }

  private getBalance(_address: string) {
    return new Promise<number>((resolve, reject) => {
      this.tokenContract.balanceOf(_address, (_error, _balance) => {
        if (_error) { reject(_error); }
        resolve(_balance.toNumber());
      });
    });
  }

  private getIssuedTotal(_address: string) {
    return new Promise<number>((resolve, reject) => {
      this.tokenContract.totalIssuedOf(_address, (_error, _issuedTotal) => {
        if (_error) { reject(_error); }
        resolve(_issuedTotal.toNumber());
      });
    });
  }

  public async updateBalances(_user: ProteaUser) {
    const newUser = new ProteaUser(_user);
    newUser.balance = await this.getBalance(newUser.address);
    newUser.issued = await this.getIssuedTotal(newUser.address);
    return newUser;
  }

}
