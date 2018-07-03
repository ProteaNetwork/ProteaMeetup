import { Web3Service } from './web3.service';
import { Injectable } from '@angular/core';
import { ProteaParty } from './interface/event';

import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';


declare let require: any;
const factoryAbi = require('./../../../build/contracts/ProteaPartyFactory.json');
const eventAbi = require('./../../../build/contracts/ProteaParty.json');

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private rinkebyFactoryAddress = '0x8B594E94BF0464f88C0d741B0feB26375E377EbE';

  // @TODO: change to state object
  public eventReady = false;
  public event = new ProteaParty();

  // User states
  public userAdmin: boolean;
  public userRegistered: boolean;
  public userAttended: boolean;
  public userPaid: boolean;

  private factoryContract: TruffleContract;
  private eventContract: TruffleContract;

  constructor(private web3: Web3Service) {
    this.initFactory();
  }

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

  // Factory/Registry
  public fetchAdminEvents(_latest: boolean = false) {
    return new Promise((resolve, reject) => {
      this.factoryContract.getUserEvents(this.web3.address, async (_error, _contractArray: string[]) => {
        if (!_contractArray) { reject(_error); }
        // If last requested
        resolve(_contractArray);
      });
    });
  }

  public deployEvent(_name: string, _deposit: number, _limit: number, _coolingPeriod: number, _encryption: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.factoryContract.deployParty(_name, _deposit, _limit, _coolingPeriod, _encryption, async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        // Run fetch latest
        resolve(result);
        // Transation mined
      });
    });
  }


  // Event functions
  public async fetchEvent(_address: string) {
    // @TODO: need to run a call to confirm the contract before setting
    this.eventContract = await this.web3.artifactsToContract(eventAbi);
    this.eventContract = this.eventContract.at(_address);
    console.log(this.eventContract);
    await this.fetchState();
    return this.eventReady;
  }

  // @TODO: Refactor completely
  private async fetchState() {
    let clean = true;
    // Event state
    const name = new Promise((resolve, reject) => {
      this.eventContract.name((_error, _name) => {
        if (_error) {
          console.error('ended error', _error);
          clean = false;
          reject(false);
        }
        this.event.name = _name.toString();
        resolve(_name);
      });
    });
    await name;

    const ended = new Promise((resolve, reject) => {
      this.eventContract.ended((_error, _status) => {
        if (_error) {
          console.error('ended error', _error);
          clean = false;
          reject(false);
        }
        this.event.ended = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await ended;

    const limit = new Promise((resolve, reject) => {
      this.eventContract.limitOfParticipants((_error, _limit) => {
        if (_error) {
          console.error('limitOfParticipants error', _error);
          clean = false;
          reject(false);
        }
        this.event.limitOfParticipants = _limit.toNumber();
        resolve(_limit);
      });
    });
    await limit;


    const registered = new Promise((resolve, reject) => {
      this.eventContract.registered((_error, _registered) => {
        if (_error) {
          console.error('registered error', _error);
          clean = false;
          reject(false);
        }
        this.event.registered = _registered.toNumber();
        resolve(_registered);
      });
    });
    await registered;

    const attended = new Promise((resolve, reject) => {
      this.eventContract.attended((_error, _attended) => {
        if (_error) {
          console.error('attended Error', _error);
          clean = false;
          reject(false);
        }
        this.event.attended = _attended.toNumber();
        resolve(_attended);
      });
    });
    await attended;

    // User states
    const isAdmin = new Promise((resolve, reject) => {
      this.eventContract.isAdmin(this.web3.address, (_error, _status) => {
      if (_error) {
        console.error('isAdmin Error', _error);
        clean = false;
        reject(false);
      }
      this.userAdmin = <boolean>_status.toString();
      resolve(_status);
    });
    });
    await isAdmin;

    const isRegistered = new Promise((resolve, reject) => {
      this.eventContract.isRegistered(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isRegistered Error', _error);
          clean = false;
          reject(false);
        }
        this.userRegistered = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await isRegistered;

    const isPaid = new Promise((resolve, reject) => {
      this.eventContract.isPaid(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isPaid Error', _error);
          clean = false;
          reject(false);
        }
        this.userPaid = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await isPaid;

    const isAttended = new Promise((resolve, reject) => {
      this.eventContract.isAttended(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isAttended Error', _error);
          clean = false;
          reject(false);
        }
        this.userAttended = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await isAttended;

    this.eventReady = clean;
  }

  // Attendee controls
  public withdraw() {
    return new Promise((resolve, reject) => {
      this.eventContract.withdraw(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve();
      });
    });
  }

  // Get view data
  public getEventName() {
    return new Promise((resolve, reject) => {
      this.eventContract.name((_error, _name) => {
        if (_error) {
          console.error('ended error', _error);
          reject(false);
        }
        this.event.name = _name.toString();
        resolve(_name);
      });
    });
  }

  public getLimit() {
    return new Promise((resolve, reject) => {
      this.eventContract.limitOfParticipants((_error, _limit) => {
        if (_error) {
          console.error('limitOfParticipants error', _error);
          reject(false);
        }
        this.event.limitOfParticipants = _limit.toNumber();
        resolve(_limit);
      });
    });
  }

  public checkEnded() {
    return new Promise((resolve, reject) => {
      this.eventContract.ended((_error, _status) => {
        if (_error) {
          console.error('ended error', _error);
          reject(false);
        }
        this.event.ended = <boolean>_status.toString();
        resolve(_status);
      });
    });
  }

  public checkAttended() {
    return new Promise((resolve, reject) => {
      this.eventContract.isAttended(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isAttended Error', _error);
          reject(false);
        }
        this.userAttended = <boolean>_status.toString();
        resolve(_status);
      });
    });
  }

  public checkPaid() {
    return new Promise((resolve, reject) => {
      this.eventContract.isPaid(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isPaid Error', _error);
          reject(false);
        }
        this.userPaid = <boolean>_status.toString();
        resolve(_status);
      });
    });
  }

  public checkRegistered() {
    return new Promise((resolve, reject) => {
      this.eventContract.isRegistered(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isRegistered Error', _error);
          reject(false);
        }
        this.userRegistered = <boolean>_status.toString();
        resolve(_status);
      });
    });
  }

  public getPayout() {
    return new Promise((resolve, reject) => {
      this.eventContract.payout((_error, _payout) => {
        if (_error) {
          console.error('Get Payout Error', _error);
          reject(false);
        }
        this.event.payout = _payout.toNumber();
        resolve(_payout);
      });
    });
  }

  public getTotalBalance() {
    return new Promise((resolve, reject) => {
      this.eventContract.totalBalance((_error, _balance) => {
        if (_error) {
          console.error('Get Payout Error', _error);
          reject(false);
        }
        this.event.payout = _balance.toNumber();
        resolve(_balance);
      });
    });
  }

  // Admin
  public manualConfirmAttend(_addresses: string[]) {
    return new Promise((resolve, reject) => {
      if (_addresses.length === 0) {
        reject('No addresses added');
      }
      this.eventContract.attend(_addresses, async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve();
      });
    });
  }

  public setLimit(_newLimit: number) {
    return new Promise((resolve, reject) => {
      if (_newLimit === this.event.limitOfParticipants || _newLimit < this.event.registered) {
        reject('New limit invalid');
      }
      this.eventContract.setLimitOfParticipants(_newLimit, async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve();
      });
    });
  }

  public paybackEnd() {
    return new Promise((resolve, reject) => {
      this.eventContract.payback(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve();
      });
    });
  }

  public cancel() {
    return new Promise((resolve, reject) => {
      this.eventContract.cancel(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve();
      });
    });
  }

  public clear() {
    return new Promise((resolve, reject) => {
      this.eventContract.clear(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.web3.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        resolve();
      });
    });
  }

}

