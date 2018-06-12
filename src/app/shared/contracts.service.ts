import { Web3Service } from './web3.service';
import { Injectable } from '@angular/core';
import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';


declare let require: any;
let tokenAbi = require('./../../../build/contracts/ERC223StandardToken.json');
let eventAbi = require('./../../../build/contracts/TokenConference.json');

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private rinkebyTokenAddress = '0x6f5996f443de8675a8101071c28830e646a6f9f7';
  private ropstenTokenAddress = '';
  private tokenContract: TruffleContract;
  private eventContact: TruffleContract;

  constructor(private web3: Web3Service) {
    this.initToken();
  }
  private initToken() {
    setTimeout(async () => {
      if (this.web3.ready) {
        this.tokenContract = await this.web3.artifactsToContract(tokenAbi);

        this.tokenContract = this.tokenContract.at(this.rinkebyTokenAddress);
        this.eventContact = await this.web3.artifactsToContract(eventAbi);
        if (this.web3.network === 4) {
          // this.tokenContract.at(this.rinkebyTokenAddress);
        } else if (this.web3.network === 3) {
          // @TODO: Ignore ropsten
          // this.tokenContract.at(this.ropstenTokenAddress);
        }
      } else {
        this.initToken();
      }
    }, 200);
  }

  fetchEvent(_address: string) {
    if (this.web3.isValidAddress(_address)) {
      this.eventContact.at(_address);
    }
  }


  // @TODO convert to async
  faucet() {
    this.tokenContract.faucet(async (_error, _txHash) => {
      if (_error) { throw _error; }
      // Request placed
      let error, result;
      [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
      console.log(error, result);
      if (!result) { throw error; }
      // Transation mined
    });
  }
}
