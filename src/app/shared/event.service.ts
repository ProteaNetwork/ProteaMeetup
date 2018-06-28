import { Web3Service } from './web3.service';
import { Injectable } from '@angular/core';

import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';


declare let require: any;
let factoryAbi = require('./../../../build/contracts/ProteaPartyFactory.json');

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private rinkebyFactoryAddress = '0x8B594E94BF0464f88C0d741B0feB26375E377EbE';

  private factoryContract: TruffleContract;
  private eventContract: TruffleContract;

  constructor(private web3: Web3Service) { }

  private async initFactory() {
    if (this.web3.ready) {
      this.factoryContract = await this.web3.artifactsToContract(factoryAbi);
      this.factoryContract = this.factoryContract.at(this.rinkebyFactoryAddress);
    } else {
      setTimeout(() => {
        this.initFactory();
      }, 200);
    }
  }

}
